import dva from 'dva';
import createLoading from 'dva-loading';

const runtimeDva = window.g_plugins.mergeConfig('dva');
let app = dva({
  history: window.g_history,
  
  ...(runtimeDva.config || {}),
});

window.g_app = app;
app.use(createLoading());
(runtimeDva.plugins || []).forEach(plugin => {
  app.use(plugin);
});

app.model({ namespace: 'activity', ...(require('D:/project/carParts-manage/src/models/activity.js').default) });
app.model({ namespace: 'activityCatalog', ...(require('D:/project/carParts-manage/src/models/activityCatalog.js').default) });
app.model({ namespace: 'apply', ...(require('D:/project/carParts-manage/src/models/apply.js').default) });
app.model({ namespace: 'appVersion', ...(require('D:/project/carParts-manage/src/models/appVersion.js').default) });
app.model({ namespace: 'article', ...(require('D:/project/carParts-manage/src/models/article.js').default) });
app.model({ namespace: 'articleCatalog', ...(require('D:/project/carParts-manage/src/models/articleCatalog.js').default) });
app.model({ namespace: 'bbsCatalog', ...(require('D:/project/carParts-manage/src/models/bbsCatalog.js').default) });
app.model({ namespace: 'card', ...(require('D:/project/carParts-manage/src/models/card.js').default) });
app.model({ namespace: 'check', ...(require('D:/project/carParts-manage/src/models/check.js').default) });
app.model({ namespace: 'developmentchecklist', ...(require('D:/project/carParts-manage/src/models/developmentchecklist.js').default) });
app.model({ namespace: 'device', ...(require('D:/project/carParts-manage/src/models/device.js').default) });
app.model({ namespace: 'donation', ...(require('D:/project/carParts-manage/src/models/donation.js').default) });
app.model({ namespace: 'donationProject', ...(require('D:/project/carParts-manage/src/models/donationProject.js').default) });
app.model({ namespace: 'Duty', ...(require('D:/project/carParts-manage/src/models/Duty.js').default) });
app.model({ namespace: 'global', ...(require('D:/project/carParts-manage/src/models/global.js').default) });
app.model({ namespace: 'group', ...(require('D:/project/carParts-manage/src/models/group.js').default) });
app.model({ namespace: 'list', ...(require('D:/project/carParts-manage/src/models/list.js').default) });
app.model({ namespace: 'login', ...(require('D:/project/carParts-manage/src/models/login.js').default) });
app.model({ namespace: 'meeting', ...(require('D:/project/carParts-manage/src/models/meeting.js').default) });
app.model({ namespace: 'menu_com', ...(require('D:/project/carParts-manage/src/models/menu_com.js').default) });
app.model({ namespace: 'menu', ...(require('D:/project/carParts-manage/src/models/menu.js').default) });
app.model({ namespace: 'moldContractDetails', ...(require('D:/project/carParts-manage/src/models/moldContractDetails.js').default) });
app.model({ namespace: 'notice', ...(require('D:/project/carParts-manage/src/models/notice.js').default) });
app.model({ namespace: 'office', ...(require('D:/project/carParts-manage/src/models/office.js').default) });
app.model({ namespace: 'officeCatalog', ...(require('D:/project/carParts-manage/src/models/officeCatalog.js').default) });
app.model({ namespace: 'org', ...(require('D:/project/carParts-manage/src/models/org.js').default) });
app.model({ namespace: 'project', ...(require('D:/project/carParts-manage/src/models/project.js').default) });
app.model({ namespace: 'reconciliation', ...(require('D:/project/carParts-manage/src/models/reconciliation.js').default) });
app.model({ namespace: 'role', ...(require('D:/project/carParts-manage/src/models/role.js').default) });
app.model({ namespace: 'setting', ...(require('D:/project/carParts-manage/src/models/setting.js').default) });
app.model({ namespace: 'shift', ...(require('D:/project/carParts-manage/src/models/shift.js').default) });
app.model({ namespace: 'staff', ...(require('D:/project/carParts-manage/src/models/staff.js').default) });
app.model({ namespace: 'stats', ...(require('D:/project/carParts-manage/src/models/stats.js').default) });
app.model({ namespace: 'todo', ...(require('D:/project/carParts-manage/src/models/todo.js').default) });
app.model({ namespace: 'user', ...(require('D:/project/carParts-manage/src/models/user.js').default) });
app.model({ namespace: 'userAuth', ...(require('D:/project/carParts-manage/src/models/userAuth.js').default) });
app.model({ namespace: 'usermanagement', ...(require('D:/project/carParts-manage/src/models/usermanagement.js').default) });
app.model({ namespace: 'userStatus', ...(require('D:/project/carParts-manage/src/models/userStatus.js').default) });
app.model({ namespace: 'workspace', ...(require('D:/project/carParts-manage/src/models/workspace.js').default) });
