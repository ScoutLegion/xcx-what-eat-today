const axios = require('axios')
const knex = require('../mysql')

module.exports = {
    getFood: async (ctx, next) => {
        console.log('开始请求饿了么接口')
        const { lat, lon } = ctx.request.query
        console.log(lat)
        console.log(lon)

        if (!lat || !lon) {
            return ctx.body = {
                msg: '无法获取经纬度',
                code: 400,
                success: false
            }
        }

        try {
            const elemeData = await axios.get(`https://www.ele.me/restapi/shopping/restaurants?extras%5B%5D=activities&geohash=wtmk695x1j5w&latitude=${lat}&limit=24&longitude=${lon}&offset=0&restaurant_category_ids%5B%5D=-100&sign=1532913317660&terminal=web`)
            if (!elemeData.data || elemeData.data.length === 0) {
                return ctx.body = {
                    msg: '附近没有店铺',
                    success: false,
                    code: 400
                }
            }
            // 随机获取店铺信息
            const shops = elemeData.data.filter(item => item.distance < 1000);
            const randomIndex = Math.floor(shops.length * Math.random())
            const shop = shops[randomIndex]

            const FoodData = await axios.get(`https://www.ele.me/restapi/shopping/v2/menu?restaurant_id=${shop.id}&terminal=web`)
            if (!FoodData.data || FoodData.data.length === 0 || !FoodData.data[0].foods || FoodData.data[0].foods.length === 0) {
                return ctx.body = {
                    msg: '附近没有美食',
                    success: true,
                    code: 200
                }
            }
            const foods = FoodData.data[0].foods.filter(item => item.specfoods[0].price > 8);
            const foodRandomIndex = Math.floor(foods.length * Math.random())
            const food = foods[foodRandomIndex]

            const res = {}
            res.image = getImage(food.image_path)
            res.name = food.name
            res.shopName = shop.name
            res.distance = shop.distance
            res.latitude = shop.latitude
            res.longitude = shop.longitude
            res.price = food.specfoods[0].price
            ctx.body = {
                success: true,
                data: res,
                code: 200,
                msg: '成功'
            }
        } catch (error) {
            ctx.state.code = -1
            // ctx.state.data=error;
        }
    },
    saveFood: async ctx => {
        const { name, shopName, distance, latitude, longitude, price, userId } = ctx.request.body

        if (!userId) {
            ctx.body = {
                success: false,
                code: -1,
                msg: 'userId不能为空'
            }
            return
        }

        await knex('user_choose_food')
            .returning('id')
            .insert({
                user_id: userId,
                food_name: name,
                food_shop_name: shopName,
                shop_distance: distance,
                shop_latitude: latitude,
                shop_longitude: longitude,
                food_price: price
            })
        ctx.body = {
            success: true,
            code: 200,
            msg: '成功'
        }
    }
}

function getImage (imagePath) {
    imagePath = insertStr(imagePath, 3, '/')
    imagePath = insertStr(imagePath, 1, '/')

    if (imagePath.indexOf('jpeg') >= 0) {
        return `https://fuss10.elemecdn.com/${imagePath}.jpeg?imageMogr2/thumbnail/400x400/format/jpeg/quality/85`
    } else {
        return `https://fuss10.elemecdn.com/${imagePath}.png?imageMogr2/thumbnail/400x400/format/jpeg/quality/85`
    }
}

let insertStr = (soure, start, newStr) => {
    return soure.slice(0, start) + newStr + soure.slice(start)
}
