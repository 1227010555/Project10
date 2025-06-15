export default {
    getTableData: () => {
        return {
            code: 200,
            data: {
                tableData: Array.from({ length: 6 }).map((_, i) => ({
                    name: `样例${i + 1}`,
                    todayBuy: Math.floor(Math.random() * 1000),    // 随机 0–999
                    monthBuy: Math.floor(Math.random() * 10000),   // 随机 0–9999
                    totalBuy: Math.floor(Math.random() * 100000),  // 随机 0–99999
                })),
            },
        };
    },

    getCountData: () => {
        return {
            code: 200,
            data: [
                {
                    name: "今日支付订单",
                    value: Math.floor(Math.random() * 5000),
                    icon: "SuccessFilled",
                    color: "#2ec7c9",
                },
                {
                    name: "今日收藏订单",
                    value: Math.floor(Math.random() * 500),
                    icon: "StarFilled",
                    color: "#ffb980",
                },
                {
                    name: "今日未支付订单",
                    value: Math.floor(Math.random() * 2000),
                    icon: "GoodsFilled",
                    color: "#5ab1ef",
                },
                {
                    name: "本月支付订单",
                    value: Math.floor(Math.random() * 20000),
                    icon: "SuccessFilled",
                    color: "#2ec7c9",
                },
                {
                    name: "本月收藏订单",
                    value: Math.floor(Math.random() * 2000),
                    icon: "StarFilled",
                    color: "#ffb980",
                },
                {
                    name: "本月未支付订单",
                    value: Math.floor(Math.random() * 8000),
                    icon: "GoodsFilled",
                    color: "#5ab1ef",
                },
            ],
        };
    },

    getChartData: () => {
        // 模糊化的日期序列
        const dates = Array.from({ length: 7 }).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return `${d.getMonth() + 1}-${d.getDate()}`;
        });

        // 随机生成各品牌每日销量数据
        const brands = ["样例A", "样例B", "样例C", "样例D", "样例E", "样例F"];
        const orderData = dates.map(date => {
            const entry = { date };
            brands.forEach(b => {
                entry[b] = Math.floor(Math.random() * 5000);
            });
            return entry;
        });

        // 随机饼图数据
        const videoData = brands.map(b => ({
            name: b,
            value: Math.floor(Math.random() * 8000),
        }));

        // 随机用户数据
        const weekdays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
        const userData = weekdays.map(day => ({
            date: day,
            new: Math.floor(Math.random() * 100),
            active: Math.floor(Math.random() * 1000),
        }));

        return {
            code: 200,
            data: {
                orderData: {
                    date: dates,
                    data: orderData,
                },
                videoData,
                userData,
            },
        };
    },
};
