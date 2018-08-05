const CONF = {
    port: '5757',
    rootPathname: '/app',

    // 微信小程序 App ID
    appId: '',

    // 微信小程序 App Secret
    appSecret: '',

    // 是否使用腾讯云代理登录小程序
    useQcloudLogin: false,

    /**
     * MySQL 配置，用来存储 session 和用户信息
     * 若使用了腾讯云微信小程序解决方案
     * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
     *
     * CREATE TABLE `user` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
  `avatar` varchar(255) NOT NULL DEFAULT '',
  `nickname` varchar(127) NOT NULL DEFAULT '',
  `name` varchar(127) NOT NULL DEFAULT '',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(2) NOT NULL DEFAULT '0',
  `gender` tinyint(2) NOT NULL DEFAULT '1',
  `city` varchar(63) NOT NULL DEFAULT '',
  `province` varchar(63) NOT NULL DEFAULT '',
  `country` varchar(63) NOT NULL DEFAULT '',
  `open_id` varchar(63) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;
     */
    mysql: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        db: 'scout_legion',
        pass: '12345678',
        char: 'utf8mb4'
    },

    cos: {
        /**
         * 地区简称
         * @查看 https://cloud.tencent.com/document/product/436/6224
         */
        region: 'ap-guangzhou',
        // Bucket 名称
        fileBucket: 'qcloudtest',
        // 文件夹
        uploadFolder: ''
    },

    serverHost: 'localhost',
    tunnelServerUrl: '',
    tunnelSignatureKey: '',
    // 填写自己的 ，创建地址：https://console.cloud.tencent.com/cam/capi
    qcloudAppId: '',
    qcloudSecretId: '',
    qcloudSecretKey: '',
    // 微信登录态有效期
    wxLoginExpires: 7200,
    wxMessageToken: 'abcdefgh'
}

module.exports = CONF
