export default {
  'POST /api/v1/login/account': (req, res) => {
    const { username, password } = req.body;
    if (username.indexOf('1') == -1) {
      return res.json({
        succee: false,
        msg: '账号或密码错误',
      });
    }
    return res.json({
      succee: true,
      data: {
        id: '1',
        username: '18860101070',
        nickname: '林先生',
        phone: '18860101070',
      },
    });
  },
  'GET /api/v1/user/currentUser': {
    code: 0,
    data: {
      id: '5ba30b72848e23b2160c5422',
      nickname: '林新强',
      phone: '18860101070',
      avatar:
        'http://xrj-edu.oss-cn-hangzhou.aliyuncs.com/5c80d531c2dc39cf0bbffc58.png?x-oss-process=style/pre',
      username: '18860101070',
    },
    msg: '操作成功',
    succee: true,
  },
  'GET /api/v1/user/list': (req, res) => {
    const { page = 1, limit = 10 } = req.body;
    const data = [];
    for (let i = 0; i < limit; i++) {
      data.push({
        id: i,
        username: `linxinqiang${i}`,
        nickname: '林新强',
        age: `${(page - 1) * limit}`,
        address: `New York No. ${i} Lake Park`,
        description: `My name is John Brown, I am ${i}2 years old, living in New York No. ${i} Lake Park.`,
      });
    }
    return res.json({
      code: 0,
      count: 122,
      curPage: page,
      data,
      limit,
      offset: 0,
      orderMap: {},
      page: 1,
      succee: true,
      totalPages: 1,
    });
  },
  'POST /api/v1/user/save': (req, res) =>
    res.json({
      succee: true,
      msg: '操作成功',
    }),
  'POST /api/v1/user/delete/:id': (req, res) =>
    // req.params.id
    res.json({
      succee: true,
      msg: '操作成功',
    }),
};
