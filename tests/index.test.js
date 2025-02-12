const axios2 = require("axios")
const { after } = require("lodash")

const BACKEND_URL = "http://localhost:3000"
const WS_URL = "ws://localhost:3001"

const axios = {
    post: async (...args) => {
        try {
            const response = await axios2.post(...args)
            return response
        } catch (error) {
            return error.response
        }
    },
    get: async (...args) => {
        try {
            const response = await axios2.get(...args)
            return response
        } catch (error) {
            return error.response
        }
    },
    put: async (...args) => {
        try {
            const response = await axios2.put(...args)
            return response
        } catch (error) {
            return error.response
        }
    },
    delete: async (...args) => {
        try {
            const response = await axios2.delete(...args)
            return response
        } catch (error) {
            return error.response
        }
    }
}

describe('Authentication', () => {
    test('User is able to sign up only once', async () => {
        const username = "swayam" + Math.random(); // kirat0.12331313
        const password = "123456789";
        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        })

        expect(response.status).toBe(200)
        const updatedResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        })

        expect(updatedResponse.status).toBe(400);
    });

    test('User signup fail with wrong payload', async () => {
        const username = "Swayam" + Math.random();
        const password = "12345678";
        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            password,
            type: "admin"
        })

        expect(response.status).toBe(400);
    })

    test("Sign in", async () => {
        const username = "Swayam" + Math.random();
        const password = "123456789";

        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        })
        expect(response.status).toBe(200)


        const signinResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        })
        expect(signinResponse.data.token).toBeDefined();

    })

    test("Sign in with wrong creds", async () => {
        const username = "Swayam" + Math.random();
        const password = "123456789";

        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password
        })
        expect(response.status).toBe(400)

        const signinResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: "WrongUsername",
            password
        })
        expect(signinResponse.status).toBe(403);

    })
})


describe('User Metadata Information', () => {
    let token;
    let avatarId;

    beforeAll(async () => {
        const username = `swayam-${Math.random()}`
        const password = "123456789";

        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        })
        expect(response.status).toBe(200)

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
                authorization: `Bearer ${token}`
            }
        })
        avatarId = avatarResponse.data.avatarId;
        console.log("avatarId", avatarId)
        console.log("avatarResponse", avatarResponse.status)

    })




    test('Can\'t Update meta data', async () => {
        const response = await axios.post(
            `${BACKEND_URL}/api/v1/user/metadata`,
            { avatarId: "123456789" }, // Invalid avatarId
            {
                headers: {
                    authorization: `Bearer ${token}`, // Ensure valid header
                },
            }
        );
        expect(response.status).toBe(400);
    })
    test('Can\'t Update meta data due to no headers', async () => {
        const response = await axios.post(
            `${BACKEND_URL}/api/v1/user/metadata`
            , {
                avatarId // random
            }, {
            headers: {
                authorization: "Bearer"
            }
        })
        expect(response.status).toBe(403);
    })

    test('Update meta data', async () => {
        const response = await axios.post(
            `${BACKEND_URL}/api/v1/user/metadata`
            , {
                avatarId // random
            }, {
            headers: {
                authorization: `Bearer ${token}`
            }
        })
        expect(response.status).toBe(200);
    })


})


describe('User Avatar Information', () => {
    let token = "";
    let avatarId = "";
    let userId = "";

    beforeAll(async () => {
        const username = "Swayam" + Math.random();
        const password = "123456789";


        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        })
        expect(response.status).toBe(200) //signedup
        userId = response.data.userId;

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
                authorization: `Bearer ${token}`
            }
        })
        avatarId = avatarResponse.data.avatarId;
        expect(avatarResponse.status).toBe(200)


    })

    test('Get avatar details for a user', async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        })
        expect(response.data.avatars.length).toBe(1);
        expect(response.data.avatars[0].userId).toBe(userId);

    })

    test('get all avatars', async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/avatars`);
        expect(response.data.avatars.length).not.toBe(0);
        const currentAvatar = response.data.avatars.find(x => x.id == avatarId);
        expect(currentAvatar).toBeDefined();
    })

})

describe('Space Information', () => {
    let mapId;
    let element1Id;
    let element2Id;
    let adminToken;
    let adminId;
    let userToken;
    let userId;

    beforeAll(async () => {
        const username = `swayam-${Math.random()}`;
        const password = "123456789";

        const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        });

        adminId = signupResponse.data.userId

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        })

        adminToken = response.data.token

        //user signup 
        const userSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username: username + "-user",
            password,
            type: "user"
        });

        userId = userSignupResponse.data.userId

        const userSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: username + "-user",
            password
        })

        userToken = userSigninResponse.data.token

        const element1Response = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true
        }, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        });

        const element2Response = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true
        }, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        })
        element1Id = element1Response.data.elementId
        element2Id = element2Response.data.elementId


        const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
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
                authorization: `Bearer ${adminToken}`
            }
        })
        mapId = mapResponse.data.mapId;

    })


    test('create space', async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test Space",
            "dimensions": "100x200",
            "mapId": mapId,
        }, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })

        expect(response.status).toBe(200)
        expect(response.data.spaceId).toBeDefined()
    })


    test('create space without mapId ', async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test Space",
            "dimensions": "100x200",
        }, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })

        expect(response.data.spaceId).toBeDefined();

    })
    test('failed to create space ', async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test Space",
        }, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })

        expect(response.status).toBe(400);

    })
    test('test for can\'t delete space ', async () => {
        const response = await axios.delete(`${BACKEND_URL}/api/v1/space/randomeId`, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })

        expect(response.status).toBe(400);

    })
    test('test to delete space ', async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test Space",
            "dimensions": "100x200",
            "mapId": mapId,
        }, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        }
        )

        const deleteSpaceResponse = await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })
        expect(deleteSpaceResponse.status).toBe(200);

    })

    test('cannot delete other\'s test', async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test Space 2",
            "dimension": "100x200",
            "mapId": mapId,
        }, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        }
        )
        const deleteSpaceResponse = await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        })

        expect(deleteSpaceResponse.status).toBe(400);

    })

    test('Admin\'s initial space ', async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        });
        expect(response.data.spaces.length).toBe(0)
    })

    test('Admin\'s space ', async () => {

        const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test",
            "dimensions": "100x200",
        }, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        });


        const spaceResponse = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        });

        // console.log("spaceResponse", spaceResponse.data)
        const filteredResponse = spaceResponse.data.spaces.find(x => x.id == response.data.spaceId)
        expect(spaceResponse.data.spaces.length).toBe(1);

        expect(filteredResponse).toBeDefined();
    })

})

describe('Arena Endpoints', () => {
    let mapId;
    let element1Id;
    let element2Id;
    let adminToken;
    let adminId;
    let userToken;
    let userId;
    let spaceId;

    beforeAll(async () => {
        const username = `swayam-${Math.random()}`;
        const password = "123456789";

        const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        });

        adminId = signupResponse.data.userId

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        })

        adminToken = response.data.token

        //user signup 
        const userSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username: username + "-user",
            password,
            type: "user"
        });

        userId = userSignupResponse.data.userId

        const userSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: username + "-user",
            password
        })

        userToken = userSigninResponse.data.token


        const element1Response = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true
        }, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        });

        const element2Response = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true
        }, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        })
        element1Id = element1Response.data.elementId
        element2Id = element2Response.data.elementId

        console.log("element1Id", element1Id)
        console.log("element2Id", element2Id)


        const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
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
                authorization: `Bearer ${adminToken}`
            }
        })
        mapId = mapResponse.data.mapId;
        console.log("mapresponse ", mapResponse.status)
        console.log("mapId", mapId)


    })



    test('create space ', async () => {
        const spaceResponse = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test Space",
            "dimensions": "100x200",
            "mapId": mapId,
        }, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })

        spaceId = spaceResponse.data.spaceId;
        console.log("spaceID", spaceId)
        expect(spaceResponse.data.spaceId).toBeDefined();

    })

    test('Non existing space', async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/randomId`, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })

        expect(response.status).toBe(400);

    })

    test('Get Existing space elements', async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })
        expect(response.data.dimensions).toBe("100x200");
        expect(response.data.elements.length).toBe(3)

    })


    test('Delete existing elements of a space', async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })



        const res = await axios.delete(`${BACKEND_URL}/api/v1/space/element`, {
            data: {
                id: response.data.elements[0].id
            }
            ,
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })

        const newResponse = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })

        expect(newResponse.data.elements.length).toBe(2)

    })

    test('Fail to Add elements in a space for random x,y', async () => {

        const response = await axios.post(`${BACKEND_URL}/api/v1/space/element`, {
            "elementId": element1Id,
            "spaceId": spaceId,
            "x": 50000,
            "y": 200010,
        }, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })
        expect(response.status).toBe(400)

    })

    test('Add elements in a space for correct x,y', async () => {
        console.log("in here")

        const response = await axios.post(`${BACKEND_URL}/api/v1/space/element`, {
            "elementId": element1Id,
            "spaceId": spaceId,
            "x": 50,
            "y": 20,
        }, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })

        const newResponse = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })

        expect(newResponse.data.elements.length).toBe(3)

    })

})


describe('Admin endpoint', () => {
    let adminToken;
    let adminId;
    let userId;
    let userToken;

    beforeAll(async () => {

        const username = `swayam-${Math.random()}`;
        const password = "123456789";

        const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        });

        adminId = signupResponse.data.userId

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        })

        adminToken = response.data.token

        //user signup 
        const userSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username: username + "-user",
            password,
            type: "user"
        });

        userId = userSignupResponse.data.userId

        const userSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: username + "-user",
            password
        })

        userToken = userSigninResponse.data.token
    })

    test('User not able to hit admin endpoints', async () => {

        const elementResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            'imageUrl': 'https://images.pexels.com/photos/7849511/pexels-photo-7849511.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            'width': 2,
            'height': 2,
            'static': 'true'
        }, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })
        expect(elementResponse.status).toBe(403)

        const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "Test space",
            "defaultElements": [
            ]
        }, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })
        expect(mapResponse.status).toBe(403)

        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
            "imageUrl": "https://images.pexels.com/photos/7849511/pexels-photo-7849511.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            "name": "jadu"
        }, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })
        expect(avatarResponse.status).toBe(403)

        const updateElement = await axios.put(`${BACKEND_URL}/api/v1/admin/element/123`, {
            "imageUrl": "https://images.pexels.com/photos/7849511/pexels-photo-7849511.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        }, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })
        expect(updateElement.status).toBe(403)

    })

    test('Admin able to hit admin endpoints', async () => {

        const elementResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            'imageUrl': 'https://images.pexels.com/photos/7849511/pexels-photo-7849511.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            'width': 2,
            'height': 2,
            'static': true
        }, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        })

        const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "Test space",
            "defaultElements": [
            ]
        }, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        })

        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
            "imageUrl": "https://images.pexels.com/photos/7849511/pexels-photo-7849511.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            "name": "jadu"
        }, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        })



        expect(elementResponse.status).toBe(200)
        expect(mapResponse.status).toBe(200)
        expect(avatarResponse.status).toBe(200)

    })

    test('Admin able to update element in a space', async () => {
        const elementResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            'imageUrl': 'https://images.pexels.com/photos/7849511/pexels-photo-7849511.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            'width': 2,
            'height': 2,
            'static': true
        }, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        })

        console.log("res", elementResponse.data)
        console.log("stat", elementResponse.status)
        const updateElement = await axios.put(`${BACKEND_URL}/api/v1/admin/element/${elementResponse.data.elementId}`, {
            "imageUrl": "https://images.pexels.com/photos/30095280/pexels-photo-30095280/free-photo-of-latte-art-in-a-cafe-setting.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        }, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        })

        expect(updateElement.status).toBe(200)
    })
})

describe('Websocket Tests', () => {
    let mapId;
    let element1Id;
    let element2Id;
    let adminToken;
    let adminId;
    let userToken;
    let userId;
    let spaceId;

    let ws1;
    let ws2;
    let ws1Messages = [];
    let ws2Messages = [];
    let userX;
    let userY;
    let adminX;
    let adminY;

    function waitForAndPopulateLatestMessage(messageArray) {
        return new Promise(resolve => {
            if (messageArray.length > 0) {
                resolve(messageArray.shift())
            } else {
                let interval = setInterval(() => {
                    if (messageArray.length > 0) {
                        resolve(messageArray.shift())
                        clearInterval(interval)
                    }
                }, 100)
            }
        })
    }


    async function HttpSetup() {
        const username = `swayam-${Math.random()}`;
        const password = "123456789";

        const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        });

        adminId = signupResponse.data.userId


        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        })

        adminToken = response.data.token

        //user signup 
        const userSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username: username + "-user",
            password,
            type: "user"
        });

        userId = userSignupResponse.data.userId

        const userSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: username + "-user",
            password
        })

        userToken = userSigninResponse.data.token


        const element1Response = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true
        }, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        });

        const element2Response = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true
        }, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        })
        element1Id = element1Response.data.elementId
        element2Id = element2Response.data.elementId



        const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
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
                authorization: `Bearer ${adminToken}`
            }
        })
        mapId = mapResponse.data.mapId;


        const spaceResponse = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test Space",
            "dimensions": "100x200",
            "mapId": mapId,
        }, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })

        spaceId = spaceResponse.data.spaceId;

        expect(spaceResponse.data.spaceId).toBeDefined();


    }
    async function wsSetup() {
        ws1 = new WebSocket(WS_URL);
        ws1.onmessage = (event) => {
            ws1Messages.push(JSON.parse(event.data))
        }

        await new Promise(r => {
            ws1.onopen = r;
        })

        console.log("ws1 connected")
        ws2 = new WebSocket(WS_URL);
        ws2.onmessage = (event) => {
            ws2Messages.push(JSON.parse(event.data))
        }
        await new Promise(r => {
            ws2.onopen = r;
        })
        console.log("ws2 connected")

    }

    beforeAll(async () => {
        await HttpSetup();
        await wsSetup();

    }, 10000)

    test('Get ack for joining the space', async () => {
        ws1.send(JSON.stringify({
            "type": "join",
            "payload": {
                "spaceId": spaceId,
                "token": adminToken,
            }
        }))
        const message1 = await waitForAndPopulateLatestMessage(ws1Messages);
        console.log("message1", message1)

        expect(message1.type).toBe("space-joined")
        expect(message1.users.length).toBe(0)

        ws2.send(JSON.stringify({
            "type": "join",
            "payload": {
                "spaceId": spaceId,
                "token": userToken,
            }
        }))

        const message2 = await waitForAndPopulateLatestMessage(ws2Messages);
        console.log("message2", message2)
        expect(message2.type).toBe("space-joined")
        expect(message2.users.length).toBe(1)


        const message3 = await waitForAndPopulateLatestMessage(ws1Messages);
        console.log("message3", message3)
        expect(message3.type).toBe("user-join")
        expect(message3.payload.userId).toBe(userId)
        expect(message3.payload.x).toBe(message2.payload.spawn.x)
        expect(message3.payload.y).toBe(message2.payload.spawn.y)

        adminX = message1.payload.spawn.x;
        adminY = message1.payload.spawn.y;

        userX = message2.payload.spawn.x;
        userY = message2.payload.spawn.y;
    })

    test('Movement Wall Limit', async () => {
        ws1.send(JSON.stringify({
            type: "move",
            payload: {
                x: 100000,
                y: 100000,
            }
        }));
        const message = await waitForAndPopulateLatestMessage(ws1Messages);
        expect(message.type).toBe("movement-rejected");
        expect(message.payload.x).toBe(adminX);
        expect(message.payload.y).toBe(adminY);
    })
    test('Movement Jump Limit', async () => {
        ws1.send(JSON.stringify({
            type: "move",
            payload: {
                x: userX + 2,
                y: 100000,
            }
        }));
        const message = await waitForAndPopulateLatestMessage(ws1Messages);
        expect(message.type).toBe("movement-rejected");
        expect(message.payload.x).toBe(adminX);
        expect(message.payload.y).toBe(adminY);
    })
    test('Correct Movement goes Out', async () => {
        ws1.send(JSON.stringify({
            type: "move",
            payload: {
                x: adminX + 1,
                y: adminY,
                userId: adminId,
            }
        }));
        const message = await waitForAndPopulateLatestMessage(ws2Messages);
        console.log("message", message)
        expect(message.type).toBe("move");
        expect(message.payload.x).toBe(adminX + 1);
        expect(message.payload.y).toBe(adminY);
    })

    test('User leaves the space', async () => {
        ws1.close();
        const message = await waitForAndPopulateLatestMessage(ws2Messages);
        expect(message.type).toBe("user-left");
        expect(message.payload.userId).toBe(adminId);
    })

    afterAll(() => {
        ws1.close();
        ws2.close();
    })
})