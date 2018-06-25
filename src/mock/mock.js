export default{
    user:{
        name: 'Anthony Huang',
        username: 'Anthony',
        password: '12345',
        age: 27,
        email: 'ahuang21.gmail.com',
        gender: 1,
        quote: 'Good, better, best. Never let it rest. \'Til your good is better and your better is best.',
        saved: [0, 1, 2],
        added: [3, 4],
        profile_img: 'p.jpg'
    },
    products: [
        { 
            id: 0, 
            title: "SanQing Mt.", 
            locationNum: 45,
            imgs:[
                { 
                    id: 0,
                    path: '0_0.jpg',
                    tags: []
                }
            ]
        },
        { 
            id: 1, 
            title: "The Bund, Shang Hai", 
            locationNum: 25,
            imgs:[
                { 
                    id: 0,
                    path: '1_0.jpg',
                    tags: [
                        {
                            id:0,
                            tagText: '#Yolo',
                            tagNum: 12
                        },
                        {
                            id:1,
                            tagText: '#quiet',
                            tagNum: 3
                        },
                        {
                            id:2,
                            tagText: '#chillplaceEver',
                            tagNum: 20
                        },
                        {
                            id:3,
                            tagText: '#justgo',
                            tagNum: 4
                        }
                    ]
                },
                {
                    id: 1,
                    path: '1_1.jpg',
                    tags: [
                        {
                            id:4,
                            tagText: '#hithere',
                            tagNum: 1
                        },
                        {
                            id:5,
                            tagText: '#lovely',
                            tagNum: 12
                        },
                        {
                            id:6,
                            tagText: '#gg',
                            tagNum: 13
                        },
                        {
                            id:7,
                            tagText: '#myplace',
                            tagNum: 12
                        },
                        {
                            id:8,
                            tagText: '#feelsgood',
                            tagNum: 14
                        }
                    ]
                }
            ],
        },
        {
            id: 2,
            title: "Universal Studio",
            locationNum: 45,
            imgs:[
                {
                    id: 0,
                    path: '2_0.jpg',
                    tags: [],
                }
            ]
        },
        { 
            id: 3,
            title: "Lake Taho",
            locationNum: 445,
            imgs:[
                {
                    id: 0,
                    path: '3_0.jpg',
                    tags: []
                }
            ],
        },
        {
            id: 4,
            title: "Yerba Buena Gardens",
            locationNum: 495,
            imgs:[
                {
                    id: 0,
                    path: '4_0.jpg',
                    tags: [
                        {
                            id:0,
                            tagText: '#smile',
                            tagNum: 2
                        },
                        {
                            id:1,
                            tagText: '#laugh',
                            tagNum: 3
                        }
                    ]
                },
                {
                    id: 1,
                    path: '4_1.jpg',
                    tags: []
                },
                {
                    id: 2,
                    path: '4_0.jpg',
                    tags: []
                },
                {
                    id: 3,
                    path: '4_1.jpg',
                    tags: []
                }
            ]
        },
    ],
}