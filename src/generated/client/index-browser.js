
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.4.0
 * Query Engine version: a9055b89e58b4b5bfb59600785423b1db3d0e75d
 */
Prisma.prismaVersion = {
  client: "6.4.0",
  engine: "a9055b89e58b4b5bfb59600785423b1db3d0e75d"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  password: 'password',
  name: 'name',
  role: 'role',
  emailVerified: 'emailVerified',
  image: 'image',
  phone: 'phone',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  avatarUrl: 'avatarUrl',
  lastCheckIn: 'lastCheckIn',
  points: 'points',
  twoFactorEnabled: 'twoFactorEnabled',
  notificationPreferences: 'notificationPreferences'
};

exports.Prisma.VerificationtokenScalarFieldEnum = {
  id: 'id',
  identifier: 'identifier',
  token: 'token',
  expires: 'expires'
};

exports.Prisma.LoginhistoryScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  country: 'country',
  city: 'city',
  isSuspicious: 'isSuspicious',
  createdAt: 'createdAt'
};

exports.Prisma.ActivesessionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  sessionToken: 'sessionToken',
  ipAddress: 'ipAddress',
  deviceInfo: 'deviceInfo',
  browserName: 'browserName',
  lastSeen: 'lastSeen',
  createdAt: 'createdAt'
};

exports.Prisma.TwofactortokenScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  token: 'token',
  expires: 'expires',
  createdAt: 'createdAt'
};

exports.Prisma.AddressScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  fullName: 'fullName',
  phone: 'phone',
  address: 'address',
  city: 'city',
  state: 'state',
  zipCode: 'zipCode',
  country: 'country',
  isDefault: 'isDefault',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BrandScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  logo: 'logo',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProductScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  code: 'code',
  description: 'description',
  price: 'price',
  salePrice: 'salePrice',
  saleStartAt: 'saleStartAt',
  saleEndAt: 'saleEndAt',
  isOnSale: 'isOnSale',
  badgeText: 'badgeText',
  image: 'image',
  category: 'category',
  weight: 'weight',
  inventory: 'inventory',
  featured: 'featured',
  brandId: 'brandId',
  originalPrice: 'originalPrice',
  tags: 'tags',
  ratingAvg: 'ratingAvg',
  ratingCount: 'ratingCount',
  soldCount: 'soldCount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt',
  isDeleted: 'isDeleted'
};

exports.Prisma.ProductimageScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  imageUrl: 'imageUrl',
  altText: 'altText',
  order: 'order',
  isPrimary: 'isPrimary',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProductmediaScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  type: 'type',
  url: 'url',
  order: 'order',
  isCover: 'isCover',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProductvariantScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  weight: 'weight',
  flavor: 'flavor',
  priceAdjustment: 'priceAdjustment',
  stock: 'stock',
  sku: 'sku',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProductviewScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  userId: 'userId',
  createdAt: 'createdAt'
};

exports.Prisma.CartScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  guestToken: 'guestToken',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CartitemScalarFieldEnum = {
  id: 'id',
  cartId: 'cartId',
  productId: 'productId',
  variantId: 'variantId',
  quantity: 'quantity',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OrderScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  status: 'status',
  subtotal: 'subtotal',
  shippingFee: 'shippingFee',
  discount: 'discount',
  total: 'total',
  couponId: 'couponId',
  couponCode: 'couponCode',
  shippingAddress: 'shippingAddress',
  shippingCity: 'shippingCity',
  shippingZipCode: 'shippingZipCode',
  shippingPhone: 'shippingPhone',
  shippingMethod: 'shippingMethod',
  carrier: 'carrier',
  trackingCode: 'trackingCode',
  shippedAt: 'shippedAt',
  deliveredAt: 'deliveredAt',
  paymentMethod: 'paymentMethod',
  paymentStatus: 'paymentStatus',
  paymentIntentId: 'paymentIntentId',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  pointsDiscount: 'pointsDiscount',
  pointsUsed: 'pointsUsed'
};

exports.Prisma.OrderitemScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  productId: 'productId',
  variantId: 'variantId',
  quantity: 'quantity',
  price: 'price',
  nameSnapshot: 'nameSnapshot',
  skuSnapshot: 'skuSnapshot',
  createdAt: 'createdAt'
};

exports.Prisma.OrdereventScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  status: 'status',
  note: 'note',
  createdAt: 'createdAt'
};

exports.Prisma.RefundrequestScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  userId: 'userId',
  orderItemId: 'orderItemId',
  reason: 'reason',
  amount: 'amount',
  status: 'status',
  adminNote: 'adminNote',
  refundMethod: 'refundMethod',
  bankAccount: 'bankAccount',
  bankName: 'bankName',
  processedAt: 'processedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ReviewScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  userId: 'userId',
  orderItemId: 'orderItemId',
  rating: 'rating',
  comment: 'comment',
  status: 'status',
  adminReply: 'adminReply',
  repliedAt: 'repliedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ReviewmediaScalarFieldEnum = {
  id: 'id',
  reviewId: 'reviewId',
  type: 'type',
  url: 'url',
  order: 'order',
  createdAt: 'createdAt'
};

exports.Prisma.CouponScalarFieldEnum = {
  id: 'id',
  code: 'code',
  discountType: 'discountType',
  discountValue: 'discountValue',
  minOrderValue: 'minOrderValue',
  maxDiscount: 'maxDiscount',
  startDate: 'startDate',
  endDate: 'endDate',
  isActive: 'isActive',
  usageLimit: 'usageLimit',
  usedCount: 'usedCount',
  category: 'category',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UservoucherScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  couponId: 'couponId',
  status: 'status',
  claimedAt: 'claimedAt',
  usedAt: 'usedAt'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  title: 'title',
  message: 'message',
  link: 'link',
  isRead: 'isRead',
  createdAt: 'createdAt'
};

exports.Prisma.BannerScalarFieldEnum = {
  id: 'id',
  imageUrl: 'imageUrl',
  title: 'title',
  subtitle: 'subtitle',
  ctaText: 'ctaText',
  ctaLink: 'ctaLink',
  startAt: 'startAt',
  endAt: 'endAt',
  priority: 'priority',
  isActive: 'isActive',
  placement: 'placement',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ContactmessageScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  phone: 'phone',
  subject: 'subject',
  message: 'message',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SystemsettingScalarFieldEnum = {
  id: 'id',
  key: 'key',
  value: 'value',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PostScalarFieldEnum = {
  id: 'id',
  title: 'title',
  slug: 'slug',
  summary: 'summary',
  content: 'content',
  image: 'image',
  authorName: 'authorName',
  category: 'category',
  isPublished: 'isPublished',
  publishedAt: 'publishedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.WishlistScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  productId: 'productId',
  createdAt: 'createdAt'
};

exports.Prisma.ProductqaScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  userId: 'userId',
  question: 'question',
  answer: 'answer',
  isPublic: 'isPublic',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProductspecificationScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  key: 'key',
  value: 'value',
  order: 'order',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProductshippingScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  weight: 'weight',
  length: 'length',
  width: 'width',
  height: 'height',
  freeShipMin: 'freeShipMin',
  shippingFee: 'shippingFee',
  estimatedDays: 'estimatedDays',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BehaviorEventScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  sessionId: 'sessionId',
  eventType: 'eventType',
  eventData: 'eventData',
  url: 'url',
  referrer: 'referrer',
  deviceType: 'deviceType',
  createdAt: 'createdAt'
};

exports.Prisma.UserSegmentScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  segment: 'segment',
  score: 'score',
  calculatedAt: 'calculatedAt',
  expiresAt: 'expiresAt'
};

exports.Prisma.AiKnowledgeScalarFieldEnum = {
  id: 'id',
  category: 'category',
  question: 'question',
  answer: 'answer',
  keywords: 'keywords',
  language: 'language',
  priority: 'priority',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ConversationHistoryScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  sessionId: 'sessionId',
  role: 'role',
  message: 'message',
  intent: 'intent',
  confidence: 'confidence',
  feedback: 'feedback',
  createdAt: 'createdAt'
};

exports.Prisma.EmailCampaignScalarFieldEnum = {
  id: 'id',
  name: 'name',
  triggerType: 'triggerType',
  subject: 'subject',
  body: 'body',
  language: 'language',
  segmentFilter: 'segmentFilter',
  scheduledAt: 'scheduledAt',
  sentCount: 'sentCount',
  openCount: 'openCount',
  clickCount: 'clickCount',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PushNotificationScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  title: 'title',
  body: 'body',
  data: 'data',
  sentAt: 'sentAt',
  readAt: 'readAt',
  deliveredAt: 'deliveredAt',
  clickedAt: 'clickedAt'
};

exports.Prisma.FlashsalecampaignScalarFieldEnum = {
  id: 'id',
  name: 'name',
  startAt: 'startAt',
  endAt: 'endAt',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.FlashsaleproductScalarFieldEnum = {
  id: 'id',
  campaignId: 'campaignId',
  productId: 'productId',
  flashSalePrice: 'flashSalePrice',
  stockLimit: 'stockLimit',
  soldCount: 'soldCount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PointtransactionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  amount: 'amount',
  type: 'type',
  description: 'description',
  orderId: 'orderId',
  createdAt: 'createdAt'
};

exports.Prisma.NewslettersubscriberScalarFieldEnum = {
  id: 'id',
  email: 'email',
  subscribedAt: 'subscribedAt'
};

exports.Prisma.EmailqueueScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  email: 'email',
  subject: 'subject',
  templateKey: 'templateKey',
  data: 'data',
  status: 'status',
  priority: 'priority',
  scheduledAt: 'scheduledAt',
  sentAt: 'sentAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.userOrderByRelevanceFieldEnum = {
  id: 'id',
  email: 'email',
  password: 'password',
  name: 'name',
  role: 'role',
  image: 'image',
  phone: 'phone',
  avatarUrl: 'avatarUrl'
};

exports.Prisma.verificationtokenOrderByRelevanceFieldEnum = {
  id: 'id',
  identifier: 'identifier',
  token: 'token'
};

exports.Prisma.loginhistoryOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  country: 'country',
  city: 'city'
};

exports.Prisma.activesessionOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  sessionToken: 'sessionToken',
  ipAddress: 'ipAddress',
  deviceInfo: 'deviceInfo',
  browserName: 'browserName'
};

exports.Prisma.twofactortokenOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  token: 'token'
};

exports.Prisma.addressOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  fullName: 'fullName',
  phone: 'phone',
  address: 'address',
  city: 'city',
  state: 'state',
  zipCode: 'zipCode',
  country: 'country'
};

exports.Prisma.brandOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  logo: 'logo'
};

exports.Prisma.productOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  code: 'code',
  description: 'description',
  badgeText: 'badgeText',
  image: 'image',
  category: 'category',
  weight: 'weight',
  brandId: 'brandId',
  tags: 'tags'
};

exports.Prisma.productimageOrderByRelevanceFieldEnum = {
  id: 'id',
  productId: 'productId',
  imageUrl: 'imageUrl',
  altText: 'altText'
};

exports.Prisma.productmediaOrderByRelevanceFieldEnum = {
  id: 'id',
  productId: 'productId',
  type: 'type',
  url: 'url'
};

exports.Prisma.productvariantOrderByRelevanceFieldEnum = {
  id: 'id',
  productId: 'productId',
  weight: 'weight',
  flavor: 'flavor',
  sku: 'sku'
};

exports.Prisma.productviewOrderByRelevanceFieldEnum = {
  id: 'id',
  productId: 'productId',
  userId: 'userId'
};

exports.Prisma.cartOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  guestToken: 'guestToken'
};

exports.Prisma.cartitemOrderByRelevanceFieldEnum = {
  id: 'id',
  cartId: 'cartId',
  productId: 'productId',
  variantId: 'variantId'
};

exports.Prisma.orderOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  status: 'status',
  couponId: 'couponId',
  couponCode: 'couponCode',
  shippingAddress: 'shippingAddress',
  shippingCity: 'shippingCity',
  shippingZipCode: 'shippingZipCode',
  shippingPhone: 'shippingPhone',
  shippingMethod: 'shippingMethod',
  carrier: 'carrier',
  trackingCode: 'trackingCode',
  paymentMethod: 'paymentMethod',
  paymentStatus: 'paymentStatus',
  paymentIntentId: 'paymentIntentId',
  notes: 'notes'
};

exports.Prisma.orderitemOrderByRelevanceFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  productId: 'productId',
  variantId: 'variantId',
  nameSnapshot: 'nameSnapshot',
  skuSnapshot: 'skuSnapshot'
};

exports.Prisma.ordereventOrderByRelevanceFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  status: 'status',
  note: 'note'
};

exports.Prisma.refundrequestOrderByRelevanceFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  userId: 'userId',
  orderItemId: 'orderItemId',
  reason: 'reason',
  status: 'status',
  adminNote: 'adminNote',
  refundMethod: 'refundMethod',
  bankAccount: 'bankAccount',
  bankName: 'bankName'
};

exports.Prisma.reviewOrderByRelevanceFieldEnum = {
  id: 'id',
  productId: 'productId',
  userId: 'userId',
  orderItemId: 'orderItemId',
  comment: 'comment',
  status: 'status',
  adminReply: 'adminReply'
};

exports.Prisma.reviewmediaOrderByRelevanceFieldEnum = {
  id: 'id',
  reviewId: 'reviewId',
  type: 'type',
  url: 'url'
};

exports.Prisma.CouponOrderByRelevanceFieldEnum = {
  id: 'id',
  code: 'code',
  discountType: 'discountType',
  category: 'category'
};

exports.Prisma.uservoucherOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  couponId: 'couponId',
  status: 'status'
};

exports.Prisma.notificationOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  title: 'title',
  message: 'message',
  link: 'link'
};

exports.Prisma.bannerOrderByRelevanceFieldEnum = {
  id: 'id',
  imageUrl: 'imageUrl',
  title: 'title',
  subtitle: 'subtitle',
  ctaText: 'ctaText',
  ctaLink: 'ctaLink',
  placement: 'placement'
};

exports.Prisma.contactmessageOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  phone: 'phone',
  subject: 'subject',
  message: 'message',
  status: 'status'
};

exports.Prisma.systemsettingOrderByRelevanceFieldEnum = {
  id: 'id',
  key: 'key',
  value: 'value'
};

exports.Prisma.postOrderByRelevanceFieldEnum = {
  id: 'id',
  title: 'title',
  slug: 'slug',
  summary: 'summary',
  content: 'content',
  image: 'image',
  authorName: 'authorName',
  category: 'category'
};

exports.Prisma.wishlistOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  productId: 'productId'
};

exports.Prisma.productqaOrderByRelevanceFieldEnum = {
  id: 'id',
  productId: 'productId',
  userId: 'userId',
  question: 'question',
  answer: 'answer'
};

exports.Prisma.productspecificationOrderByRelevanceFieldEnum = {
  id: 'id',
  productId: 'productId',
  key: 'key',
  value: 'value'
};

exports.Prisma.productshippingOrderByRelevanceFieldEnum = {
  id: 'id',
  productId: 'productId'
};

exports.Prisma.behaviorEventOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  sessionId: 'sessionId',
  eventType: 'eventType',
  url: 'url',
  referrer: 'referrer',
  deviceType: 'deviceType'
};

exports.Prisma.userSegmentOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  segment: 'segment'
};

exports.Prisma.aiKnowledgeOrderByRelevanceFieldEnum = {
  id: 'id',
  category: 'category',
  question: 'question',
  answer: 'answer',
  keywords: 'keywords',
  language: 'language'
};

exports.Prisma.conversationHistoryOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  sessionId: 'sessionId',
  role: 'role',
  message: 'message',
  intent: 'intent',
  feedback: 'feedback'
};

exports.Prisma.emailCampaignOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name',
  triggerType: 'triggerType',
  subject: 'subject',
  body: 'body',
  language: 'language'
};

exports.Prisma.pushNotificationOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  title: 'title',
  body: 'body'
};

exports.Prisma.flashsalecampaignOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name'
};

exports.Prisma.flashsaleproductOrderByRelevanceFieldEnum = {
  id: 'id',
  campaignId: 'campaignId',
  productId: 'productId'
};

exports.Prisma.pointtransactionOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  description: 'description',
  orderId: 'orderId'
};

exports.Prisma.newslettersubscriberOrderByRelevanceFieldEnum = {
  id: 'id',
  email: 'email'
};

exports.Prisma.emailqueueOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  email: 'email',
  subject: 'subject',
  templateKey: 'templateKey',
  status: 'status',
  priority: 'priority'
};


exports.Prisma.ModelName = {
  user: 'user',
  verificationtoken: 'verificationtoken',
  loginhistory: 'loginhistory',
  activesession: 'activesession',
  twofactortoken: 'twofactortoken',
  address: 'address',
  brand: 'brand',
  product: 'product',
  productimage: 'productimage',
  productmedia: 'productmedia',
  productvariant: 'productvariant',
  productview: 'productview',
  cart: 'cart',
  cartitem: 'cartitem',
  order: 'order',
  orderitem: 'orderitem',
  orderevent: 'orderevent',
  refundrequest: 'refundrequest',
  review: 'review',
  reviewmedia: 'reviewmedia',
  Coupon: 'Coupon',
  uservoucher: 'uservoucher',
  notification: 'notification',
  banner: 'banner',
  contactmessage: 'contactmessage',
  systemsetting: 'systemsetting',
  post: 'post',
  wishlist: 'wishlist',
  productqa: 'productqa',
  productspecification: 'productspecification',
  productshipping: 'productshipping',
  behaviorEvent: 'behaviorEvent',
  userSegment: 'userSegment',
  aiKnowledge: 'aiKnowledge',
  conversationHistory: 'conversationHistory',
  emailCampaign: 'emailCampaign',
  pushNotification: 'pushNotification',
  flashsalecampaign: 'flashsalecampaign',
  flashsaleproduct: 'flashsaleproduct',
  pointtransaction: 'pointtransaction',
  newslettersubscriber: 'newslettersubscriber',
  emailqueue: 'emailqueue'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
