const zh = {
  global: {
    app: 'IFBox',
    next: '下一步',
    back: '返 回',
    search: '搜 索',
    confirm: '确 认',
    finish: '完 成',
    ok: '确 认',
    cancel: '取 消',
    error: '错误',
    required: '请输入{name}',
    success: '{name}成功!',
    noData: '暂无数据',
    noData1: '暂无数据',
    no: '否',
    nothing: '-',
    yes: '是',
    errorType: '{name}格式错误',
    view: '查看',
    null: '暂无',
    null2: '暂无',
    Insufficient: '余额不足',
    entryError: '输入错误'
  },
  home: {
    title: '管理你的临界 IFBox 资产',
    banner: '安全·稳定·开源',
    itemTitle1: '安全·可靠',
    itemText1: '您的私钥保存在您本地，并受到多重保护，我们永远不会访问您的私人信息。助记词采用业内最高24助记词进行加密。',
    itemTitle2: '稳定·开源',
    itemText2: '我们的钱包代码一直在Github上进行开源，也希望社群的开发者能够一起开发我们的钱包。您也可以下载我们的代码进行私有部署。',
    itemTitle3: '方便·易用',
    itemText3: 'IFBox是多语言网页轻钱包，随时随地可以使用的您的钱包进行发行、支付等操作。',
    itemTitle4: '隐匿·保护',
    itemText4: 'IFBox钱包不会收集您的任何信息，使用IFBox网络中token也不会透露任何您的私人信息。',
    account: '钱包账户',
    staking: '委托抵押',
    issue: 'Token发行',
    deposit: '存款盒子',
    future: '远期支付盒子',
    create: '创建您的钱包',
    wallet: '钱包',
    dapp: '应用商店'
  },
  agree: {
    title: '服务条款',
    term1: '我知道我的钱包信息存放在我的个人电脑上，不会发送至 IFBox 服务器，所有的加密都在浏览器本地完成。',
    term2: '我知道 IFBox 无法访问我的私人信息，也无法参与解决任何的资金损失问题。',
    term3: '我已经阅读并同意 ',
    use: '使用条款',
    and: '和',
    privacy: '隐私条款',
    confirm: '同意并继续',
    termUrl: 'http://hashgard-io.oss-cn-hongkong.aliyuncs.com/terms/HashgardTermsofService_CN.pdf',
    privacyUrl: 'http://hashgard-io.oss-cn-hongkong.aliyuncs.com/terms/GardBoxPrivacyPolicy_CN.pdf'
  },
  passport: {
    title: '创建一个新钱包或导入钱包',
    banner: 'IF钱包是一个免费的、开源的网页钱包，用户可以使用IF钱包创建或导入钱包，使用IF代币完成例如转账等一系列操作.',
    create: '创建钱包',
    createBreif: '创建全新的钱包来管理 IFBox 的网络资产。',
    login: '钱包切换',
    loginBreif: '直接输入密码使用本地已经存在的 IF 钱包。',
    logout: '注 销',
    backup: '导出 KeyStore',
    privateKey: '导出私钥',
    backupCopy: '复制 KeyStore 到剪贴板',
    backupFile: '下载 KeyStore 文件',
    edit: '编辑名称',
    delete: '删除钱包',
    deleteWarn: '钱包的所有信息都会被删除，只能用该钱包的助记词或 KeyStore 恢复钱包，请确保您已做好备份。',
    recover: '导入钱包',
    recoverBreif: '导入已经存在的钱包来管理 IFBox 的网络资产。',
    math: '麦子钱包',
    useMath: '使用麦子钱包',
    switchWallet: '切换地址',
    backups: '已备份，点我验证',
    network: '切换到不同的 IFBox 网络'
  },
  create: {
    warn1: '密码用户保护您的私钥和授权交易，请妥善保存。',
    warn2: 'IFBox 钱包不存储密码，也无法帮您找回，请务必牢记!!',
    name: '钱包名称',
    nameLength: '钱包名称不应长于12字符',
    pass: '密码',
    passCheck: '确认密码',
    passWarn: '密码至少8位，且包含数字和字母!',
    passCheckWarn: '密码不一致!',
    exist: '钱包名称已存在!',
    mnemonic: '您的助记词',
    mnemonicWarn: '助记词错误',
    safety: '请妥善保管',
    mnemonicBreif: '抄写好您的钱包助记词，并保存在只有你知道的地方,助记词用于恢复或重置钱包密码',
    reset: '重 置',
    confirm: '确认您的助记词',
    backup: '是否从IFBox钱包中清除该助记词?',
    success: '钱包创建成功!',
    clickCopy: '点我复制',
    mnemonicConfirm: '助记词确认',
    mnemonicInfo: '请在输入框中填写“我已经抄写并保存好助记词了”',
    mnemonicInfo2: '我已经抄写并保存好助记词了'
  },
  recover: {
    key: 'KeyStore 文本',
    keyFile: 'KeyStore 文件',
    drag: '将文件拖到此处，或',
    click: '点击上传',
    phrase: '助记词',
    keyError: 'KeyStore 格式错误!'
  },
  main: {
    receive: '收款',
    deposit: '存款',
    qrcode: '二维码',
    send: '转账',
    manage: '管 理',
    copy: '已复制到剪切板',
    assets: '我的资产',
    txs: '交易记录',
    txInfo: '交易详情',
    allTxs: '查看全部',
    empty: '暂无交易记录',
    keyWarn: 'KeyStore 是用你的私钥和密码加密后的 JSON 文件, 您可以用密码从 KeyStore 中取回私钥，请妥善保管。',
    voucher: '凭证',
    takeBack: '请取回',
    transaction: '交易',
    draw: '领 币',
    AdequateBalance: '余额充足',
    seconds: '30秒后再领取',
    box: '盒子',
    delegate: '委托',
    manage: '管理',
    copy: '复制',
    coinType: '币种',
    available: '可用',
    frozen: '冻结',
    operation: '操作',
    migrate: '兑换',
  },
  send: {
    form: '转账',
    confirm: '确认交易信息',
    passError: '密码错误',
    reject: '交易签名被拒绝',
    netError: '网络错误',
    finish: '转账结果',
    denom: '转账币种',
    amount: '数量',
    amountWarn: '数量不足',
    amountWarnPositive: '数量必须大于零',
    amountWarnInvalid: '小数位数不支持',
    address: '收款地址',
    addressWarn: '地址不可用',
    sender: '转出地址',
    memo: '备注',
    txHash: 'TxHash',
    all: '全部转出',
    balance: '账户余额',
    fee: '手续费',
    error: '交易发送失败',
    again: '继续转账',
    back: '回到钱包',
    block: '区块高度',
    time: '交易时间',
    codeMessage1: '该二维码仅支持IFBox网络资产转入,暂不支持其他虚拟货币资产',
    codeMessage2: '转入时请确认资产属性.其他虚拟货币资产冲入将无法找回'
  },
  staking: {
    delegationTotal: '所有委托',
    reward: '委托收益',
    withdraw: '取回收益',
    withdrawAll: '一键取回收益',
    delegate: '委托 IF',
    delegations: '我的委托',
    validators: '全部验证人节点',
    tokensMax: '抵押数量优先',
    commissionMin: '佣金最低',
    fromValidator: '转出验证人节点',
    toValidator: '转入验证人节点',
    validator: '验证人节点',
    name: '节点名称',
    status: '状态',
    active: '活跃',
    candidate: '候选',
    jailed: '异常',
    minSelf: '最小自委托',
    address: '地址',
    detail: '委托详情',
    tokens: '抵押总量',
    commission: '佣金',
    max: '最高佣金',
    commissionChange: '修改佣金最大幅度',
    website: '网站',
    description: '描述',
    all: '委托全部',
    unbind: '赎回委托',
    unbindAll: '赎回全部',
    redelegate: '转移委托',
    redelegateAll: '转移全部',
    validatorDup: '验证人节点相同',
    unbinding: '解锁中',
    delegated: '已委托',
    unpaidReward: '未领取收益',
  },
  singleTokenAssets: {
    available: '可 用',
    lock: '锁 定'
  },
  receiveVoucher: {
    extract: '提取'
  },
  owner: {
    brif: '转移管理员权限是【非常危险】的操作，一旦转给其他地址，该Token将从你的【Token发行列表】中移除！',
    from: 'Token 所有者'
  },
  footer: {
    copyright: '© 2020 IFBox Foundation Ltd. All Rights Reserved.'
  },
  redelegate: {
    my: '我的转委托',
    amount: '数量',
    validatorFrom: '转出节点',
    validatorTo: '转入节点',
    completionTime: '完成时间',
    block: '区块高度',
    detail: '转移委托'
  },
  myNode: {
    myNode: '我的节点',
    name: '节点名称',
    comissionRate: '佣金',
    address: '节点地址',
    time: '更新时间',
    info: '节点信息',
    state: '状态',
    delegate: '抵押总量',
    comissionMax: '最高佣金',
    comissionMaxChange: '修改佣金最大幅度',
    website: '网站',
    details: '描述',
    withdraw: '提取收益地址',
    rewards: '收益奖励',
    commission: '佣金奖励',
    setWithdraw: '设置提取收益地址',
    set: '设置'
  }
};
export default zh;