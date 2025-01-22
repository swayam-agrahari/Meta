const { axios } = require("axios")

describe('Authentication', () => {
    BACKEND_URL = "http://localhost:3000"
    test('User signup once', async () => {
        const username = "Swayam" + Math.random();
        const password = "123456";
        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "Admin"
        })

        expect(response.statusCode).toBe(200);

        const updatedResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "Admin"
        })
        expect(response.statusCode).toBe(400);
    })
    test('User signup fail with wrong payload', async () => {
        const username = "Swayam" + Math.random();
        const password = "123456";
        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            password,
            type: "Admin"
        })

        expect(response.statusCode).toBe(400);
    })

    test("Sign in", async () => {
        const username = "Swayam" + Math.random();
        const password = "123456";

        const response = await axios.post(`${BACKEND_URL}/av1/api/signup`, {
            username,
            password
        })
        expect(response).toBe(200)

        const signinResponse = await axios.post(`${BACKEND_URL}/av1/api/signin`, {
            username,
            password
        })
        expect(signinResponse.data.token).toBeDefined();

    })

    test("Sign in with wrong creds", async () => {
        const username = "Swayam" + Math.random();
        const password = "123456";

        const response = await axios.post(`${BACKEND_URL}/av1/api/signup`, {
            username,
            password
        })
        expect(response).toBe(400)

        const signinResponse = await axios.post(`${BACKEND_URL}/av1/api/signin`, {
            username: "WrongUsername",
            password
        })
        expect(signinResponse.statusCode).toBe(403);

    })
})


describe('User Metadata Information', () => {
    let token = "";
    let avatarId = "";

    beforeAll(async () => {

        test("Sign in", async () => {
            const username = "Swayam" + Math.random();
            const password = "123456";

            const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
                username,
                password,
                type: "Admin"
            })
            expect(response.statusCode).toBe(200)

            const signinResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
                username,
                password
            })
            expect(signinResponse.data.token).toBeDefined();
            token = signinResponse.data.token;

            const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
                "imageUrl": "https://images.pexels.com/photos/7849511/pexels-photo-7849511.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                "name": "jadu"
            }, {
                headers: {
                    "Authentication": "Bearer " + token
                }
            })
            avatarId = avatarResponse.data.avatarId;

        })


    })

    test('Can\'t Update meta data', async () => {
        const response = await axios.post(
            `${BACKEND_URL}/api/vi/user/metadata`
            , {
                avatarId: "123456789" // random
            }, {
            headers: {
                "Authentication": "Bearer " + token
            }
        })
        expect(response.statusCode).toBe(400);
    })
    test('Can\'t Update meta data due to no headers', async () => {
        const response = await axios.post(
            `${BACKEND_URL}/api/vi/user/metadata`
            , {
                avatarId // random
            }, {
            headers: {
                "Authentication": "Bearer"
            }
        })
        expect(response.statusCode).toBe(404);
    })

    test('Update meta data', async () => {
        const response = await axios.post(
            `${BACKEND_URL}/api/vi/user/metadata`
            , {
                avatarId // random
            }, {
            headers: {
                "Authentication": "Bearer " + token
            }
        })
        expect(response.statusCode).toBe(400);
    })
})


describe('User Avatar Information', () => {
    let token = "";
    let avatarId = "";
    let userId = ""

    beforeAll(async () => {

        test("Sign in", async () => {
            const username = "Swayam" + Math.random();
            const password = "123456";

            const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
                username,
                password,
                type: "Admin"
            })
            expect(response.statusCode).toBe(200) //signedup
            userId = response.body.userId;

            const signinResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
                username,
                password
            })
            expect(signinResponse.body.token).toBeDefined();
            token = signinResponse.data.token;

            const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
                "imageUrl": "https://images.pexels.com/photos/7849511/pexels-photo-7849511.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                "name": "jadu"
            }, {
                headers: {
                    "Authentication": "Bearer " + token
                }
            })
            avatarId = avatarResponse.data.avatarId;

        })
    })

    test('Get avatar details for a user', async () => {
        const response = axios.get(`${BACKEND_URL}/api/v1/user/metadeta/bulk?ids=[${userId}]`, {

        })
        expect(response.data.avatars.length).toBe(1);
        expect(response.data.avatars[0].userId).toBe(userId);

    })

    test('get all avatars', async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/avatars`);
        expect(response.data.avatars.length).not.toBe(1);
        const currentAvatar = response.data.avatars.find(x => x.id = avatarId)
        expect(currentAvatar).toBeDefined();
    })
})

describe('Space Information', () => {
    let token;
    let adminId;
    let userId;
    let userToken;
    let mapId;
    let element1Id;
    let element2Id;
    let spaceId;

    beforeAll(async () => {

        test("Sign in as Admin", async () => {
            const username = "Swayam" + Math.random();
            const password = "123456";

            const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
                username,
                password,
                type: "Admin"
            })
            expect(signupResponse.statusCode).toBe(200) //signedup
            adminId = signupResponse.body.userId;

            const signinResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
                username,
                password
            })
            expect(signinResponse.body.token).toBeDefined();
            token = signinResponse.data.token;

            const elem1 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
                'imageUrl': 'https://images.pexels.com/photos/7849511/pexels-photo-7849511.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                'width': 2,
                'height': 2,
                'static': 'true'
            }, {
                headers: {
                    'Authentication': `Bearer ${token}`
                }
            })
            const elem2 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
                'imageUrl': 'https://images.pexels.com/photos/7849511/pexels-photo-7849511.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                'width': 2,
                'height': 2,
                'static': 'true'
            }, {
                headers: {
                    'Authentication': `Bearer ${token}`
                }
            })

            element1Id = elem1.data.id;
            element2Id = elem2.data.id;

            const map = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
                "thumbnail": "https://thumbnail.com/a.png",
                "dimensions": "100x200",
                "name": "Test space",
                "defaultElements": [{
                    elementId: element1Id,
                    x: 20,
                    y: 20
                }, {
                    elementId: element1Id,
                    x: 18,
                    y: 20
                }, {
                    elementId: element2Id,
                    x: 19,
                    y: 20
                }
                ]
            }, {
                headers: {
                    'Authentication': `Bearer ${token}`
                }
            })

            mapId = map.id;


        })

        test("Sign in as user", async () => {
            const username = "Swayam" + Math.random();
            const password = "123456";

            const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
                username,
                password,
                type: "user"
            })
            expect(signupResponse.statusCode).toBe(200) //signedup
            userId = signupResponse.body.userId;

            const signinResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
                username,
                password
            })
            expect(signinResponse.body.token).toBeDefined();
            userToken = signinResponse.data.token;


        })
    })
    test('create space ', async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test Space",
            "dimension": "100x200",
            "mapId": mapId,
        })

        expect(response.spaceId).toBeDefined();
        spaceId = response.spaceId;

    }, {
        headers: {
            "Authentication": "Bearer " + userToken
        }
    })

    test('create space without mapId ', async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test Space",
            "dimension": "100x200",
        })

        expect(response.spaceId).toBeDefined();

    }, {
        headers: {
            "Authentication": "Bearer " + userToken
        }
    })

    test('failed to create space ', async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test Space",
        })

        expect(response.statusCode).toBe(400);

    }, {
        headers: {
            "Authentication": "Bearer " + userToken
        }
    })

    test('test for can\'t delete space ', async () => {
        const response = await axios.delete(`${BACKEND_URL}/api/v1/space/randomeId`)

        expect(response.statusCode).toBe(400);

    }, {
        headers: {
            "Authentication": "Bearer " + userToken
        }
    })
    test('test to delete space ', async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test Space",
            "dimension": "100x200",
            "mapId": mapId,
        }, {
            headers: {
                "Authentication": "Bearer " + userToken
            }
        }
        )
        const deleteSpaceResponse = await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`)

        expect(deleteSpaceResponse.statusCode).toBe(200);

    }, {
        headers: {
            "Authentication": "Bearer " + userToken
        }
    })

    test('cannot delete other\'s test', async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test Space 2",
            "dimension": "100x200",
            "mapId": mapId,
        }, {
            headers: {
                "Authentication": "Bearer " + userToken
            }
        }
        )
        const deleteSpaceResponse = await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`)

        expect(deleteSpaceResponse.statusCode).toBe(400);

    }, {
        headers: {
            "Authentication": "Bearer " + token
        }
    })

    test('Admin\'s initial space ', async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`);
        expect(response.data.spaces.length).toBe(0)
    })
    test('Admin\'s space ', async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test Space",
            "dimension": "100x200",
            "mapId": mapId,
        }, {
            headers: {
                "Authentication": "Bearer " + token
            }
        })
        const spaceResponse = await axios.get(`${BACKEND_URL}/api/v1/space/all`);
        const filteredResponse = spaceResponse.find(x => x.id == response.spaceId)
        expect(spaceResponse.data.spaces.length).toBe(1);
        expect(filteredResponse.data.spaces).toBeDefined();
    })

})

describe('Arena Endpoints', () => {
    let token;
    let adminId;
    let userId;
    let userToken;
    let mapId;
    let element1Id;
    let element2Id;
    let spaceId;

    beforeAll(async () => {

        test("Sign in as Admin", async () => {
            const username = "Swayam" + Math.random();
            const password = "123456";

            const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
                username,
                password,
                type: "Admin"
            })
            expect(signupResponse.statusCode).toBe(200) //signedup
            adminId = signupResponse.body.userId;

            const signinResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
                username,
                password
            })
            expect(signinResponse.body.token).toBeDefined();
            token = signinResponse.data.token;

            const elem1 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
                'imageUrl': 'https://images.pexels.com/photos/7849511/pexels-photo-7849511.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                'width': 2,
                'height': 2,
                'static': 'true'
            }, {
                headers: {
                    'Authentication': `Bearer ${token}`
                }
            })
            const elem2 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
                'imageUrl': 'https://images.pexels.com/photos/7849511/pexels-photo-7849511.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                'width': 2,
                'height': 2,
                'static': 'true'
            }, {
                headers: {
                    'Authentication': `Bearer ${token}`
                }
            })

            element1Id = elem1.data.id;
            element2Id = elem2.data.id;

            const map = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
                "thumbnail": "https://thumbnail.com/a.png",
                "dimensions": "100x200",
                "name": "Test space",
                "defaultElements": [{
                    elementId: element1Id,
                    x: 20,
                    y: 20
                }, {
                    elementId: element1Id,
                    x: 18,
                    y: 20
                }, {
                    elementId: element2Id,
                    x: 19,
                    y: 20
                }
                ]
            }, {
                headers: {
                    'Authentication': `Bearer ${token}`
                }
            })

            mapId = map.id;


        })

        test("Sign in as user", async () => {
            const username = "Swayam" + Math.random();
            const password = "123456";

            const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
                username,
                password,
                type: "user"
            })
            expect(signupResponse.statusCode).toBe(200) //signedup
            userId = signupResponse.body.userId;

            const signinResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
                username,
                password
            })
            expect(signinResponse.body.token).toBeDefined();
            userToken = signinResponse.data.token;


        })
    })
    test('create space ', async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test Space",
            "dimension": "100x200",
            "mapId": mapId,
        })

        expect(response.spaceId).toBeDefined();
        spaceId = response.spaceId;

    }, {
        headers: {
            "Authentication": "Bearer " + userToken
        }
    })

    test('Non existing space', async () => {
        const response = axios.get(`${BACKEND_URL}/api/v1/space/randomId`, {
            headers: {
                "Authentication": "Bearer " + userToken
            }
        })

        expect(response.statusCode).toBe(400);

    })

    test('Existing space elements', async () => {
        const response = axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
            headers: {
                "Authentication": "Bearer " + userToken
            }
        })
        expect(response.data.dimensions).toBe("100x200");
        expect(response.data.elements.length).toBe(3)

    })


    test('Delete existing elements of a space', async () => {
        const response = axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
            headers: {
                "Authentication": "Bearer " + userToken
            }
        })

        const deleteElement = axios.delete(`${BACKEND_URL}/api/v1/space/element`, {
            spaceId: spaceId,
            elementId: response.data.elements[0].id,
        })
        expect(deleteElement.data.elements.length).toBe(2)

    })

})
