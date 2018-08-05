
const knex = require('../mysql')
const configs = require('../config')
const axios = require('axios')

module.exports = {
    getUserInfo: async (ctx, next) => {
    // 通过 Koa 中间件进行登录态校验之后
    // 登录信息会被存储到 ctx.state.$wxInfo
    // 具体查看：
        if (ctx.state.$wxInfo.loginState === 1) {
      // loginState 为 1，登录态校验成功
            ctx.state.data = ctx.state.$wxInfo.userinfo
        } else {
            ctx.state.code = -1
        }
    },
    addUser: async ctx => {
        const { nickname, avatar, country, province, city, gender, code } = ctx.request.body

        try {
            const userAuth = await axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${configs.appId}&secret=${configs.appSecret}&js_code=${code}&grant_type=authorization_code`)
            if (!userAuth.data.openid) {
                ctx.state.code = -1
                ctx.state.data = userAuth.data.errmsg
                return
            }
            let id
            const ids = await knex('user').where({ open_id: userAuth.data.openid }).select('id')
            if (ids && ids.length > 0) {
                await knex('user').where(ids[0]).update({
                    nickname: nickname,
                    avatar: avatar,
                    name: nickname,
                    gender: gender,
                    city: city,
                    province: province,
                    country: country
                })
                id = ids[0].id
            } else {
                const newIds = await knex('user')
          .returning('id')
          .insert({
              nickname: nickname,
              avatar: avatar,
              name: nickname,
              gender: gender,
              city: city,
              province: province,
              country: country,
              open_id: userAuth.data.openid,
              updated_at: new Date()
          })
                id = newIds[0]
            }
            ctx.state.code = 0
            ctx.state.data = { id }
        } catch (error) {
            console.error('sql insert failure', error)
        }
    }
}
