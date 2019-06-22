// 用于封装待请求的API接口

const baseUrl = 'https://mini.dtpark.top/index.php/';
// const baseUrl = 'http://mini.ghtt.com/index.php/';

const loginUrl = baseUrl + 'login';

const eduBindUrl = baseUrl + 'edubind';

const showInfoUrl = baseUrl + 'showinfo';

const eduUnbindUrl = baseUrl + 'eduunbind';

const weekCurriculumUrl= baseUrl + 'weektimetable';

const todayCurriculumUrl = baseUrl + 'todaytimetable';

const listCurriculumUrl = baseUrl + 'listtimetable';

const campuscardInfoUrl = baseUrl + 'campuscardinfo';

const campuscardBindUrl = baseUrl + 'campuscardbind';

const campuscardUnbindUrl = baseUrl + 'campuscardunbind';

const expensesRecordUrl = baseUrl + 'expensesrecord';

const todayExpensesUrl = baseUrl + 'todayexpenses';

const classroomUrl = baseUrl + 'classroom';

const toolsListUrl = baseUrl + 'toolslist';

const getBannerUrl = baseUrl + 'showBanner';

const getNoticeListUrl = baseUrl + 'notice/list';
const getNoticeDetailUrl = baseUrl + 'notice/detail';

const forumDetailUrl = baseUrl + 'forum/detail';
const forumListUrl = baseUrl + 'forum/list';
const forumInfoUrl = baseUrl + 'forum/info';

const hitwhNewsUrl = baseUrl + 'news/list'
const hitwhNewsDetailUrl = baseUrl + 'news/detail'


export default {
  
  loginUrl: loginUrl,
  eduBindUrl: eduBindUrl,
  showInfoUrl: showInfoUrl,
  eduUnbindUrl: eduUnbindUrl,
  weekCurriculumUrl,
  todayCurriculumUrl,
  listCurriculumUrl,
  campuscardInfoUrl,
  campuscardBindUrl,
  campuscardUnbindUrl,
  expensesRecordUrl,
  todayExpensesUrl,
  classroomUrl,
  toolsListUrl,
  getBannerUrl,
  getNoticeListUrl,
  getNoticeDetailUrl,
  forumDetailUrl,
  forumListUrl,
  forumInfoUrl,
  hitwhNewsUrl,
  hitwhNewsDetailUrl
}