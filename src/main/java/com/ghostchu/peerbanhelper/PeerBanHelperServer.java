package com.ghostchu.peerbanhelper;

import com.ghostchu.peerbanhelper.btn.BtnNetwork;
import com.ghostchu.peerbanhelper.database.DatabaseHelper;
import com.ghostchu.peerbanhelper.database.DatabaseManager;
import com.ghostchu.peerbanhelper.downloader.Downloader;
import com.ghostchu.peerbanhelper.downloader.DownloaderLastStatus;
import com.ghostchu.peerbanhelper.downloader.impl.qbittorrent.QBittorrent;
import com.ghostchu.peerbanhelper.downloader.impl.transmission.Transmission;
import com.ghostchu.peerbanhelper.event.LivePeersUpdatedEvent;
import com.ghostchu.peerbanhelper.event.PBHServerStartedEvent;
import com.ghostchu.peerbanhelper.event.PeerBanEvent;
import com.ghostchu.peerbanhelper.event.PeerUnbanEvent;
import com.ghostchu.peerbanhelper.invoker.BanListInvoker;
import com.ghostchu.peerbanhelper.invoker.impl.CommandExec;
import com.ghostchu.peerbanhelper.invoker.impl.IPFilterInvoker;
import com.ghostchu.peerbanhelper.ipdb.IPDB;
import com.ghostchu.peerbanhelper.metric.BasicMetrics;
import com.ghostchu.peerbanhelper.metric.HitRateMetric;
import com.ghostchu.peerbanhelper.metric.impl.persist.PersistMetrics;
import com.ghostchu.peerbanhelper.module.*;
import com.ghostchu.peerbanhelper.module.impl.rule.*;
import com.ghostchu.peerbanhelper.module.impl.webapi.*;
import com.ghostchu.peerbanhelper.peer.Peer;
import com.ghostchu.peerbanhelper.text.Lang;
import com.ghostchu.peerbanhelper.torrent.Torrent;
import com.ghostchu.peerbanhelper.util.JsonUtil;
import com.ghostchu.peerbanhelper.util.MsgUtil;
import com.ghostchu.peerbanhelper.util.WatchDog;
import com.ghostchu.peerbanhelper.util.rule.ModuleMatchCache;
import com.ghostchu.peerbanhelper.util.time.ExceptedTime;
import com.ghostchu.peerbanhelper.util.time.TimeoutProtect;
import com.ghostchu.peerbanhelper.web.JavalinWebContainer;
import com.ghostchu.peerbanhelper.wrapper.BanMetadata;
import com.ghostchu.peerbanhelper.wrapper.PeerAddress;
import com.ghostchu.peerbanhelper.wrapper.PeerMetadata;
import com.ghostchu.peerbanhelper.wrapper.TorrentWrapper;
import com.google.common.collect.ImmutableMap;
import com.google.gson.reflect.TypeToken;
import com.maxmind.geoip2.model.AsnResponse;
import com.maxmind.geoip2.model.CityResponse;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.bspfsystems.yamlconfiguration.configuration.ConfigurationSection;
import org.bspfsystems.yamlconfiguration.configuration.MemoryConfiguration;
import org.bspfsystems.yamlconfiguration.file.YamlConfiguration;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.io.File;
import java.io.IOException;
import java.lang.management.ManagementFactory;
import java.lang.management.ThreadInfo;
import java.lang.management.ThreadMXBean;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.sql.SQLException;
import java.util.*;
import java.util.concurrent.*;
import java.util.logging.Level;

@Slf4j
public class PeerBanHelperServer {
    private final Map<PeerAddress, BanMetadata> BAN_LIST = new ConcurrentHashMap<>();
    private final YamlConfiguration profile;
    @Getter
    private final List<Downloader> downloaders = new ArrayList<>();
    @Getter
    private final long banDuration;
    @Getter
    private final int httpdPort;
    @Getter
    private final boolean hideFinishLogs;
    @Getter
    private final YamlConfiguration mainConfig;
    private final ModuleMatchCache moduleMatchCache;
    private final File banListFile;
    private final ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();
    @Getter
    private final HitRateMetric hitRateMetric = new HitRateMetric();
    @Getter
    private final List<BanListInvoker> banListInvoker = new ArrayList<>();
    private final String pbhServerAddress;
    private ScheduledExecutorService BAN_WAVE_SERVICE;
    @Getter
    private ImmutableMap<PeerAddress, PeerMetadata> LIVE_PEERS = ImmutableMap.of();
    @Getter
    private BtnNetwork btnNetwork;
    @Getter
    private BasicMetrics metrics;
    private DatabaseManager databaseManager;
    @Getter
    private DatabaseHelper databaseHelper;
    @Getter
    private ModuleManager moduleManager;
    @Getter
    @Nullable
    private IPDB ipdb = null;
    private WatchDog banWaveWatchDog;
    @Getter
    private JavalinWebContainer webContainer;


    public PeerBanHelperServer(String pbhServerAddress, YamlConfiguration profile, YamlConfiguration mainConfig) throws SQLException {
        this.pbhServerAddress = pbhServerAddress;
        loadDownloaders();
        this.profile = profile;
        this.banDuration = profile.getLong("ban-duration");
        this.mainConfig = mainConfig;
        this.httpdPort = mainConfig.getInt("server.http");
        this.hideFinishLogs = mainConfig.getBoolean("logger.hide-finish-log");
        this.moduleMatchCache = new ModuleMatchCache();
        this.banListFile = new File(Main.getDataDirectory(), "banlist.dump");
        registerHttpServer();
        this.moduleManager = new ModuleManager();
        setupIPDB();
        setupBtn();
        try {
            prepareDatabase();
        } catch (Exception e) {
            log.error(Lang.DATABASE_FAILURE, e);
            throw e;
        }
        registerMetrics();
        registerModules();
        resetKnownDownloaders();
        registerBanListInvokers();
        loadBanListToMemory();
        registerTimer();
        banListInvoker.forEach(BanListInvoker::reset);
        Main.getEventBus().post(new PBHServerStartedEvent(this));
    }

    public void loadDownloaders() {
        this.downloaders.clear();
        ConfigurationSection clientSection = mainConfig.getConfigurationSection("client");
        for (String client : clientSection.getKeys(false)) {
            ConfigurationSection downloaderSection = clientSection.getConfigurationSection(client);
            String endpoint = downloaderSection.getString("endpoint");
            switch (downloaderSection.getString("type").toLowerCase(Locale.ROOT)) {
                case "qbittorrent" -> {
                    registerDownloader(QBittorrent.loadFromConfig(client, downloaderSection));
                    log.info(Lang.DISCOVER_NEW_CLIENT, "qBittorrent", client, endpoint);
                }
                case "transmission" -> {
                    registerDownloader(Transmission.loadFromConfig(client, pbhServerAddress, downloaderSection));
                    log.info(Lang.DISCOVER_NEW_CLIENT, "Transmission", client, endpoint);
                }
            }
        }
    }

    public void saveDownloaders() throws IOException {
        ConfigurationSection clientSection = new MemoryConfiguration();
        for (Downloader downloader : this.downloaders) {
            clientSection.set(downloader.getName(), downloader.saveDownloader());
        }
        mainConfig.set("client", clientSection);
        mainConfig.save(Main.getMainConfigFile());
    }

    public void registerDownloader(Downloader downloader) {
        this.downloaders.add(downloader);
    }

    public void unregisterDownloader(Downloader downloader) {
        this.downloaders.remove(downloader);
    }

    private void setupIPDB() {
        try {
            String accountId = mainConfig.getString("ip-database.account-id", "");
            String licenseKey = mainConfig.getString("ip-database.license-key", "");
            String databaseCity = mainConfig.getString("ip-database.database-city", "");
            String databaseASN = mainConfig.getString("ip-database.database-asn", "");
            boolean autoUpdate = mainConfig.getBoolean("ip-database.auto-update");
            if (accountId.isEmpty() || licenseKey.isEmpty() || databaseCity.isEmpty() || databaseASN.isEmpty()) {
                log.warn(Lang.IPDB_NEED_CONFIG);
                return;
            }
            this.ipdb = new IPDB(new File(Main.getDataDirectory(), "ipdb"), accountId, licenseKey, databaseCity, databaseASN, autoUpdate);
        } catch (Exception e) {
            log.info(Lang.IPDB_INVALID, e);
        }
    }

    private void resetKnownDownloaders() {
        try {
            for (Downloader downloader : downloaders) {
                downloader.login();
                downloader.setBanList(Collections.emptyList(), null, null);
            }
        } catch (Exception e) {
            log.warn(Lang.RESET_DOWNLOADER_FAILED, e);
        }
    }

    public void setupBtn() {
        if (this.btnNetwork != null) {
            this.btnNetwork.close();
        }
        BtnNetwork btnm;
        try {
            log.info(Lang.BTN_NETWORK_CONNECTING);
            btnm = new BtnNetwork(this, mainConfig.getConfigurationSection("btn"));
            log.info(Lang.BTN_NETWORK_ENABLED);
        } catch (IllegalStateException e) {
            btnm = null;
            log.info(Lang.BTN_NETWORK_NOT_ENABLED);
        }
        this.btnNetwork = btnm;
    }

    private void registerBanListInvokers() {
        banListInvoker.add(new IPFilterInvoker(this));
        banListInvoker.add(new CommandExec(this));
    }

    public void shutdown() {
        // place some clean code here
        dumpBanListToFile();
        log.info(Lang.SHUTDOWN_CLOSE_METRICS);
        this.metrics.close();
        log.info(Lang.SHUTDOWN_UNREGISTER_MODULES);
        this.moduleManager.unregisterAll();
        log.info(Lang.SHUTDOWN_CLOSE_DATABASE);
        this.databaseManager.close();
        log.info(Lang.SHUTDOWN_CLEANUP_RESOURCES);
        this.moduleMatchCache.close();
        if (this.ipdb != null) {
            this.ipdb.close();
        }
        this.downloaders.forEach(d -> {
            try {
                d.close();
            } catch (Exception e) {
                log.error("Failed to close download {}", d.getName(), e);
            }
        });
        log.info(Lang.SHUTDOWN_DONE);
    }

    private void loadBanListToMemory() {
        if (!mainConfig.getBoolean("persist.banlist")) {
            return;
        }
        try {
            if (!banListFile.exists()) {
                return;
            }
            String json = Files.readString(banListFile.toPath(), StandardCharsets.UTF_8);
            Map<PeerAddress, BanMetadata> data = JsonUtil.getGson().fromJson(json, new TypeToken<Map<PeerAddress, BanMetadata>>() {
            }.getType());
            if (data == null) {
                return;
            }
            this.BAN_LIST.putAll(data);
            log.info(Lang.LOAD_BANLIST_FROM_FILE, data.size());
            downloaders.forEach(downloader -> {
                downloader.login();
                downloader.setBanList(BAN_LIST.keySet(), null, null);
            });
            Collection<TorrentWrapper> relaunch = data.values().stream().map(BanMetadata::getTorrent).toList();
            downloaders.forEach(downloader -> downloader.relaunchTorrentIfNeededByTorrentWrapper(relaunch));
        } catch (Exception e) {
            log.error(Lang.LOAD_BANLIST_FAIL, e);
        } finally {
            banListFile.delete();
        }
    }

    private void dumpBanListToFile() {
        if (!mainConfig.getBoolean("persist.banlist")) {
            return;
        }
        log.info(Lang.SHUTDOWN_SAVE_BANLIST);
        try {
            if (!banListFile.exists()) {
                banListFile.createNewFile();
            }
            Files.writeString(banListFile.toPath(), JsonUtil.prettyPrinting().toJson(BAN_LIST));
        } catch (IOException e) {
            log.error(Lang.SHUTDOWN_SAVE_BANLIST_FAILED);
        }
    }

    private void prepareDatabase() throws SQLException {
        this.databaseManager = new DatabaseManager();
        this.databaseHelper = new DatabaseHelper(databaseManager);
    }

    private void registerMetrics() {
        this.metrics = new PersistMetrics(databaseHelper);
    }

    private void registerHttpServer() {
        String token = System.getenv("PBH_API_TOKEN");
        if (token == null) {
            token = System.getProperty("pbh.api_token");
        }
        if (token == null) {
            token = getMainConfig().getString("server.token");
        }
        this.webContainer = new JavalinWebContainer(httpdPort, token);
    }

    private void registerTimer() {
        this.banWaveWatchDog = new WatchDog("BanWave Thread", profile.getLong("check-interval", 5000) + (1000 * 60), this::watchDogHungry, null);
        registerBanWaveTimer();
        this.banWaveWatchDog.start();
    }

    private void registerBanWaveTimer() {
        if (BAN_WAVE_SERVICE != null && (!BAN_WAVE_SERVICE.isShutdown() || !BAN_WAVE_SERVICE.isTerminated())) {
            BAN_WAVE_SERVICE.shutdownNow().forEach(r -> log.warn("Unfinished runnable: {}", r));
        }
        BAN_WAVE_SERVICE = Executors.newScheduledThreadPool(1, r -> {
            Thread thread = new Thread(r);
            thread.setName("Ban Wave");
            thread.setDaemon(true);
            return thread;
        });
        log.info(Lang.PBH_BAN_WAVE_STARTED);
        BAN_WAVE_SERVICE.scheduleAtFixedRate(this::banWave, 1, profile.getLong("check-interval", 5000), TimeUnit.MILLISECONDS);
    }


    private void watchDogHungry() {
        StringBuilder threadDump = new StringBuilder(System.lineSeparator());
        ThreadMXBean threadMXBean = ManagementFactory.getThreadMXBean();
        for (ThreadInfo threadInfo : threadMXBean.dumpAllThreads(true, true)) {
            threadDump.append(MsgUtil.threadInfoToString(threadInfo));
        }
        log.info(threadDump.toString());
        registerBanWaveTimer();
        Main.getGuiManager().createNotification(Level.WARNING, Lang.BAN_WAVE_WATCH_DOG_TITLE, Lang.BAN_WAVE_WATCH_DOG_DESCRIPTION);
    }


    /**
     * 启动新的一轮封禁序列
     */
    public void banWave() {
        banWaveWatchDog.setLastOperation("Ban wave - start");
        long startTimer = System.currentTimeMillis();
        try {
            // 重置所有下载器状态为健康，这样后面失败就会对其降级
            banWaveWatchDog.setLastOperation("Reset last status");
            // 声明基本集合
            // 需要重启的种子列表
            Map<Downloader, Collection<Torrent>> needRelaunched = new ConcurrentHashMap<>();
            // 被解除封禁的对等体列表
            banWaveWatchDog.setLastOperation("Remove expired bans");
            Collection<BanMetadata> unbannedPeers = removeExpiredBans();
            // 被新封禁的对等体列表
            Collection<BanMetadata> bannedPeers = new CopyOnWriteArrayList<>();
            // 当前所有活跃的对等体列表
            banWaveWatchDog.setLastOperation("Collect peers");
            Map<Downloader, Map<Torrent, List<Peer>>> peers = collectPeers();
            // 更新 LIVE_PEERS 用于数据展示
            banWaveWatchDog.setLastOperation("Update live peers");
            executor.submit(() -> updateLivePeers(peers));
            // ========== 处理封禁逻辑 ==========
            Map<Downloader, List<BanDetail>> downloaderBanDetailMap = new ConcurrentHashMap<>();
            banWaveWatchDog.setLastOperation("Check Bans");
            try (TimeoutProtect protect = new TimeoutProtect(ExceptedTime.CHECK_BANS.getTimeout(), (t) -> {
                log.warn(Lang.TIMING_CHECK_BANS);
            })) {
                downloaders.forEach(downloader -> protect.getService().submit(() -> downloaderBanDetailMap.put(downloader, checkBans(peers.get(downloader)))));
            }
            // 添加被封禁的 Peers 到封禁列表中
            banWaveWatchDog.setLastOperation("Add banned peers into banlist");
            try (TimeoutProtect protect = new TimeoutProtect(ExceptedTime.ADD_BAN_ENTRY.getTimeout(), (t) -> {
                log.warn(Lang.TIMING_ADD_BANS);
            })) {
                downloaderBanDetailMap.forEach((downloader, details) -> {
                    List<Torrent> relaunch = Collections.synchronizedList(new ArrayList<>());
                    details.forEach(detail -> {
                        protect.getService().submit(() -> {
                            if (detail.result().action() == PeerAction.BAN) {
                                IPDBResponse ipdbResponse = queryIPDB(detail.peer().getAddress());
                                BanMetadata banMetadata = new BanMetadata(detail.result().moduleContext().getClass().getName(), downloader.getName(),
                                        System.currentTimeMillis(), System.currentTimeMillis() + banDuration,
                                        detail.torrent(), detail.peer(), detail.result().rule(), detail.result().reason(),
                                        ipdbResponse.cityResponse(), ipdbResponse.asnResponse());
                                bannedPeers.add(banMetadata);
                                relaunch.add(detail.torrent());
                                banPeer(banMetadata, detail.torrent(), detail.peer());
                                log.warn(Lang.BAN_PEER, detail.peer().getAddress(), detail.peer().getPeerId(), detail.peer().getClientName(), detail.peer().getProgress(), detail.peer().getUploaded(), detail.peer().getDownloaded(), detail.torrent().getName(), detail.result().reason());
                            }
                        });
                    });
                    needRelaunched.put(downloader, relaunch);
                });
            }
            banWaveWatchDog.setLastOperation("Apply banlist");
            // 如果需要，则应用更改封禁列表到下载器
            try (TimeoutProtect protect = new TimeoutProtect(ExceptedTime.APPLY_BANLIST.getTimeout(), (t) -> {
                log.warn(Lang.TIMING_APPLY_BAN_LIST);
            })) {
                downloaders.forEach(downloader -> protect.getService().submit(() -> updateDownloader(downloader, !bannedPeers.isEmpty() || !unbannedPeers.isEmpty(),
                        needRelaunched.getOrDefault(downloader, Collections.emptyList()),
                        bannedPeers, unbannedPeers)));
            }
            if (!hideFinishLogs) {
                long downloadersCount = peers.keySet().size();
                long torrentsCount = peers.values().stream().mapToLong(e -> e.keySet().size()).sum();
                long peersCount = peers.values().stream().flatMap(e -> e.values().stream()).mapToLong(List::size).sum();
                log.info(Lang.BAN_WAVE_CHECK_COMPLETED, downloadersCount, torrentsCount, peersCount, bannedPeers.size(), unbannedPeers.size(), System.currentTimeMillis() - startTimer);
            }
            banWaveWatchDog.setLastOperation("Completed");
        } finally {
            banWaveWatchDog.feed();
            metrics.recordCheck();
        }
    }

    private List<BanDetail> checkBans(Map<Torrent, List<Peer>> provided) {
        List<BanDetail> details = Collections.synchronizedList(new ArrayList<>());
        try (TimeoutProtect protect = new TimeoutProtect(ExceptedTime.CHECK_BANS.getTimeout(), (t) -> {
            log.warn(Lang.TIMING_CHECK_BANS);
        })) {
            for (Torrent torrent : provided.keySet()) {
                List<Peer> peers = provided.get(torrent);
                for (Peer peer : peers) {
                    protect.getService().submit(() -> {
                        BanResult banResult = checkBan(torrent, peer);
                        details.add(new BanDetail(torrent, peer, banResult));
                    });
                }
            }
        }
        return details;
    }

    private void updateLivePeers(Map<Downloader, Map<Torrent, List<Peer>>> peers) {
        Map<PeerAddress, PeerMetadata> livePeers = new ConcurrentHashMap<>();
        try (TimeoutProtect protect = new TimeoutProtect(ExceptedTime.UPDATE_LIVE_PEERS.getTimeout(), (t) -> {
        })) {
            peers.forEach((downloader, tasks) ->
                    tasks.forEach((torrent, peer) ->
                            peer.forEach(p -> {
                                protect.getService().submit(() -> {
                                    PeerAddress address = p.getAddress();
                                    IPDBResponse ipdbResponse = queryIPDB(address);
                                    PeerMetadata metadata = new PeerMetadata(
                                            downloader.getName(),
                                            torrent, p, ipdbResponse.cityResponse(), ipdbResponse.asnResponse()
                                    );
                                    livePeers.put(address, metadata);
                                });
                            })));
        }
        LIVE_PEERS = ImmutableMap.copyOf(livePeers);
        Main.getEventBus().post(new LivePeersUpdatedEvent(LIVE_PEERS));
    }

    /**
     * 如果需要，则更新下载器的封禁列表
     * 对于 Transmission 等下载器来说，传递 needToRelaunch 会重启对应 Torrent
     *
     * @param downloader     要操作的下载器
     * @param updateBanList  是否需要从 BAN_LIST 常量更新封禁列表到下载器
     * @param needToRelaunch 传递一个集合，包含需要重启的种子；并非每个下载器都遵守此行为；对于 qbittorrent 等 banlist 可被实时应用的下载器来说，不会重启 Torrent
     */
    public void updateDownloader(@NotNull Downloader downloader, boolean updateBanList, @NotNull Collection<Torrent> needToRelaunch, @Nullable Collection<BanMetadata> added, @Nullable Collection<BanMetadata> removed) {
        if (!updateBanList && needToRelaunch.isEmpty()) return;
        try {
            if (!downloader.login()) {
                log.warn(Lang.ERR_CLIENT_LOGIN_FAILURE_SKIP, downloader.getName(), downloader.getEndpoint());
                downloader.setLastStatus(DownloaderLastStatus.ERROR);
                return;
            } else {
                downloader.setLastStatus(DownloaderLastStatus.HEALTHY);
            }
            downloader.setBanList(BAN_LIST.keySet(), added, removed);
            downloader.relaunchTorrentIfNeeded(needToRelaunch);
        } catch (Throwable th) {
            log.warn(Lang.ERR_UPDATE_BAN_LIST, downloader.getName(), downloader.getEndpoint(), th);
            downloader.setLastStatus(DownloaderLastStatus.ERROR);
        }
    }

    /**
     * 移除过期的封禁
     *
     * @return 当封禁条目过期时，移除它们（解封禁）
     */
    public Collection<BanMetadata> removeExpiredBans() {
        List<PeerAddress> removeBan = new ArrayList<>();
        List<BanMetadata> metadata = new ArrayList<>();
        for (Map.Entry<PeerAddress, BanMetadata> pair : BAN_LIST.entrySet()) {
            if (System.currentTimeMillis() >= pair.getValue().getUnbanAt()) {
                removeBan.add(pair.getKey());
                metadata.add(pair.getValue());
            }
        }
        removeBan.forEach(this::unbanPeer);
        if (!removeBan.isEmpty()) {
            log.info(Lang.PEER_UNBAN_WAVE, removeBan.size());
        }
        return metadata;
    }

    /**
     * 注册 Modules
     */
    private void registerModules() {
        log.info(Lang.WAIT_FOR_MODULES_STARTUP);
        moduleManager.register(new IPBlackList(this, profile));
        moduleManager.register(new PeerIdBlacklist(this, profile));
        moduleManager.register(new ClientNameBlacklist(this, profile));
        moduleManager.register(new ProgressCheatBlocker(this, profile));
        moduleManager.register(new MultiDialingBlocker(this, profile));
        //moduleManager.register(new ActiveProbing(this, profile));
        moduleManager.register(new AutoRangeBan(this, profile));
        moduleManager.register(new BtnNetworkOnline(this, profile));
        moduleManager.register(new DownloaderCIDRBlockList(this, profile));
        moduleManager.register(new IPBlackRuleList(this, profile, databaseHelper));
        moduleManager.register(new PBHMetricsController(this, profile));
        moduleManager.register(new PBHBanController(this, profile, databaseHelper));
        moduleManager.register(new PBHMetadataController(this, profile));
        moduleManager.register(new PBHDownloaderController(this, profile));
        moduleManager.register(new RuleSubController(this, profile));
        moduleManager.register(new PBHAuthenticateController(this, profile));
        moduleManager.register(new PBHLogsController(this, profile));
    }

    public Map<Downloader, Map<Torrent, List<Peer>>> collectPeers() {
        Map<Downloader, Map<Torrent, List<Peer>>> peers = new HashMap<>();
        try (var service = Executors.newVirtualThreadPerTaskExecutor()) {
            downloaders.forEach(downloader -> service.submit(() -> {
                Map<Torrent, List<Peer>> p = collectPeers(downloader);
                peers.put(downloader, p);
            }));
        }
        return peers;
    }

    public Map<Torrent, List<Peer>> collectPeers(Downloader downloader) {
        Map<Torrent, List<Peer>> peers = new ConcurrentHashMap<>();
        if (!downloader.login()) {
            log.warn(Lang.ERR_CLIENT_LOGIN_FAILURE_SKIP, downloader.getName(), downloader.getEndpoint());
            downloader.setLastStatus(DownloaderLastStatus.ERROR);
            return Collections.emptyMap();
        }
        List<Torrent> torrents = downloader.getTorrents();
        Semaphore parallelReqRestrict = new Semaphore(16);
        try (TimeoutProtect protect = new TimeoutProtect(ExceptedTime.COLLECT_PEERS.getTimeout(), (t) -> {
            log.warn(Lang.TIMING_COLLECT_PEERS);
        })) {
            torrents.forEach(torrent -> protect.getService().submit(() -> {
                try {
                    parallelReqRestrict.acquire();
                    peers.put(torrent, downloader.getPeers(torrent));
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                } finally {
                    parallelReqRestrict.release();
                }
            }));
            downloader.setLastStatus(DownloaderLastStatus.HEALTHY);
        }

        return peers;
    }

    public IPDBResponse queryIPDB(PeerAddress address) {
        CityResponse cityResponse = null;
        AsnResponse asnResponse = null;
        try {
            if (ipdb != null) {
                InetAddress mmdbAddress = address.getAddress().toInetAddress();
                if (ipdb.getMmdbCity() != null) {
                    cityResponse = ipdb.getMmdbCity().city(mmdbAddress);
                }
                if (ipdb.getMmdbASN() != null) {
                    asnResponse = ipdb.getMmdbASN().asn(mmdbAddress);
                }
            }
        } catch (Exception ignored) {
        }

        return new IPDBResponse(cityResponse, asnResponse);
    }

    private boolean isHandshaking(Peer peer) {
        if (peer.getPeerId() == null || peer.getPeerId().isEmpty()) {
            // 跳过此 Peer，PeerId 不能为空，此时只建立了连接，但还没有完成交换
            return true;
        }
        //noinspection RedundantIfStatement
        if (peer.getDownloadSpeed() <= 0 && peer.getUploadSpeed() <= 0) {
            // 跳过此 Peer，速度都是0，可能是没有完成握手
            return true;
        }
        return false;
    }

    /**
     * 检查一个在给定 Torrent 上的对等体是否需要被封禁
     *
     * @param torrent Torrent
     * @param peer    对等体
     * @return 封禁规则检查结果
     */
    @NotNull
    public BanResult checkBan(@NotNull Torrent torrent, @NotNull Peer peer) {
        List<BanResult> results = new ArrayList<>();
        for (FeatureModule registeredModule : moduleManager.getModules()) {
            if (!(registeredModule instanceof RuleFeatureModule module)) {
                continue;
            }
            if (module.needCheckHandshake() && isHandshaking(peer)) {
                continue; // 如果模块需要握手检查且peer正在握手 则跳过检查
            }
            if (module.isCheckCacheable() && !isHandshaking(peer)) {
                if (moduleMatchCache.shouldSkipCheck(module, torrent, peer.getAddress(), true)) {
                    continue;
                }
            }
            BanResult banResult = module.shouldBanPeer(torrent, peer, executor);
            if (banResult.action() == PeerAction.SKIP) {
                return banResult;
            }
            results.add(banResult);
        }
        BanResult result = new BanResult(null, PeerAction.NO_ACTION, "No matches", "No matches");
        for (BanResult r : results) {
            if (r.action() == PeerAction.BAN) {
                result = r;
                break;
            }
        }
        return result;
    }

    /**
     * 获取目前所有被封禁的对等体的集合的拷贝
     *
     * @return 不可修改的集合拷贝
     */
    @NotNull
    public Map<PeerAddress, BanMetadata> getBannedPeers() {
        return ImmutableMap.copyOf(BAN_LIST);
    }

    /**
     * 以指定元数据封禁一个特定的对等体
     *
     * @param peer        对等体 IP 地址
     * @param banMetadata 封禁元数据
     */
    public void banPeer(@NotNull BanMetadata banMetadata, @NotNull Torrent torrentObj, @NotNull Peer peer) {
        BAN_LIST.put(peer.getAddress(), banMetadata);
        metrics.recordPeerBan(peer.getAddress(), banMetadata);
        banListInvoker.forEach(i -> i.add(peer.getAddress(), banMetadata));
        if (mainConfig.getBoolean("lookup.dns-reverse-lookup")) {
            executor.submit(() -> {
                try {
                    InetAddress address = InetAddress.getByName(peer.getAddress().getAddress().toString());
                    if (!address.getCanonicalHostName().equals(peer.getAddress().getIp())) {
                        banMetadata.setReverseLookup(address.getCanonicalHostName());
                    } else {
                        banMetadata.setReverseLookup("N/A");
                    }
                } catch (UnknownHostException ignored) {
                    banMetadata.setReverseLookup("N/A");
                }
            });
        } else {
            banMetadata.setReverseLookup("N/A");
        }
        Main.getEventBus().post(new PeerBanEvent(peer.getAddress(), banMetadata, torrentObj, peer));
    }

    /**
     * 解除一个指定对等体
     *
     * @param address 对等体 IP 地址
     * @return 此对等体的封禁元数据；返回 null 代表此对等体没有被封禁
     */
    @Nullable
    public BanMetadata unbanPeer(@NotNull PeerAddress address) {
        BanMetadata metadata = BAN_LIST.remove(address);
        if (metadata != null) {
            metrics.recordPeerUnban(address, metadata);
            banListInvoker.forEach(i -> i.remove(address, metadata));
        }
        Main.getEventBus().post(new PeerUnbanEvent(address, metadata));
        return metadata;
    }

    public ImmutableMap<PeerAddress, PeerMetadata> getLivePeersSnapshot() {
        return LIVE_PEERS;
    }

    public record IPDBResponse(
            CityResponse cityResponse,
            AsnResponse asnResponse
    ) {
    }

    public record BanDetail(
            Torrent torrent,
            Peer peer,
            BanResult result
    ) {
    }
}
