const axios2 = require("axios")

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
            type: "Admin"
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


// describe('User Metadata Information', () => {
//     let token = "";
//     let avatarId = "";

//     beforeAll(async () => {

//         test("Sign in", async () => {
//             const username = "Swayam" + Math.random();
//             const password = "123456";

//             const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
//                 username,
//                 password,
//                 type: "Admin"
//             })
//             expect(response.status).toBe(200)

//             const signinResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
//                 username,
//                 password
//             })
//             expect(signinResponse.data.token).toBeDefined();
//             token = signinResponse.data.token;

//             const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
//                 "imageUrl": "https://images.pexels.com/photos/7849511/pexels-photo-7849511.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//                 "name": "jadu"
//             }, {
//                 headers: {
//                     authorization: `Bearer ${token}`
//                 }
//             })
//             avatarId = avatarResponse.data.avatarId;

//         })


//     })

//     test('Can\'t Update meta data', async () => {
//         const response = await axios.post(
//             `${BACKEND_URL}/api/vi/user/metadata`
//             , {
//                 avatarId: "123456789" // random
//             }, {
//             headers: {
//                 authorization: `Bearer ${token}`
//             }
//         })
//         expect(response.status).toBe(400);
//     })
//     test('Can\'t Update meta data due to no headers', async () => {
//         const response = await axios.post(
//             `${BACKEND_URL}/api/vi/user/metadata`
//             , {
//                 avatarId // random
//             }, {
//             headers: {
//                 authorization: "Bearer"
//             }
//         })
//         expect(response.status).toBe(404);
//     })

//     test('Update meta data', async () => {
//         const response = await axios.post(
//             `${BACKEND_URL}/api/vi/user/metadata`
//             , {
//                 avatarId // random
//             }, {
//             headers: {
//                 authorization: `Bearer ${token}`
//             }
//         })
//         expect(response.status).toBe(400);
//     })
// })


// describe('User Avatar Information', () => {
//     let token = "";
//     let avatarId = "";
//     let userId = ""

//     beforeAll(async () => {

//         test("Sign in", async () => {
//             const username = "Swayam" + Math.random();
//             const password = "123456";

//             const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
//                 username,
//                 password,
//                 type: "Admin"
//             })
//             expect(response.status).toBe(200) //signedup
//             userId = response.data.userId;

//             const signinResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
//                 username,
//                 password
//             })
//             expect(signinResponse.data.token).toBeDefined();
//             token = signinResponse.data.token;

//             const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
//                 "imageUrl": "https://images.pexels.com/photos/7849511/pexels-photo-7849511.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//                 "name": "jadu"
//             }, {
//                 headers: {
//                     authorization: `Bearer ${token}`
//                 }
//             })
//             avatarId = avatarResponse.data.avatarId;

//         })
//     })

//     test('Get avatar details for a user', async () => {
//         const response = axios.get(`${BACKEND_URL}/api/v1/user/metadeta/bulk?ids=[${userId}]`, {

//         })
//         expect(response.data.avatars.length).toBe(1);
//         expect(response.data.avatars[0].userId).toBe(userId);

//     })

//     test('get all avatars', async () => {
//         const response = await axios.get(`${BACKEND_URL}/api/v1/avatars`);
//         expect(response.data.avatars.length).not.toBe(1);
//         const currentAvatar = response.data.avatars.find(x => x.id = avatarId)
//         expect(currentAvatar).toBeDefined();
//     })
// })

// describe('Space Information', () => {
//     let token;
//     let adminId;
//     let userId;
//     let userToken;
//     let mapId;
//     let element1Id;
//     let element2Id;
//     let spaceId;

//     beforeAll(async () => {

//         test("Sign in as Admin", async () => {
//             const username = "Swayam" + Math.random();
//             const password = "123456";

//             const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
//                 username,
//                 password,
//                 type: "Admin"
//             })
//             expect(signupResponse.status).toBe(200) //signedup
//             adminId = signupResponse.data.userId;

//             const signinResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
//                 username,
//                 password
//             })
//             expect(signinResponse.data.token).toBeDefined();
//             token = signinResponse.data.token;

//             const elem1 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
//                 'imageUrl': 'https://images.pexels.com/photos/7849511/pexels-photo-7849511.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//                 'width': 2,
//                 'height': 2,
//                 'static': 'true'
//             }, {
//                 headers: {
//                     authorization: `Bearer ${token}`
//                 }
//             })
//             const elem2 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
//                 'imageUrl': 'https://images.pexels.com/photos/7849511/pexels-photo-7849511.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//                 'width': 2,
//                 'height': 2,
//                 'static': 'true'
//             }, {
//                 headers: {
//                     authorization: `Bearer ${token}`
//                 }
//             })

//             element1Id = elem1.data.id;
//             element2Id = elem2.data.id;

//             const map = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
//                 "thumbnail": "https://thumbnail.com/a.png",
//                 "dimensions": "100x200",
//                 "name": "Test space",
//                 "defaultElements": [{
//                     elementId: element1Id,
//                     x: 20,
//                     y: 20
//                 }, {
//                     elementId: element1Id,
//                     x: 18,
//                     y: 20
//                 }, {
//                     elementId: element2Id,
//                     x: 19,
//                     y: 20
//                 }
//                 ]
//             }, {
//                 headers: {
//                     authorization: `Bearer ${token}`
//                 }
//             })

//             mapId = map.response.id;


//         })

//         test("Sign in as user", async () => {
//             const username = "Swayam" + Math.random();
//             const password = "123456";

//             const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
//                 username,
//                 password,
//                 type: "user"
//             })
//             expect(signupResponse.status).toBe(200) //signedup
//             userId = signupResponse.data.userId;

//             const signinResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
//                 username,
//                 password
//             })
//             expect(signinResponse.data.token).toBeDefined();
//             userToken = signinResponse.data.token;


//         })
//     })
//     test('create space ', async () => {
//         const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
//             "name": "Test Space",
//             "dimension": "100x200",
//             "mapId": mapId,
//         })

//         expect(response.spaceId).toBeDefined();
//         spaceId = response.spaceId;

//     }, {
//         headers: {
//             authorization: `Bearer ${userToken}`
//         }
//     })

//     test('create space without mapId ', async () => {
//         const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
//             "name": "Test Space",
//             "dimension": "100x200",
//         })

//         expect(response.spaceId).toBeDefined();

//     }, {
//         headers: {
//             authorization: `Bearer ${userToken}`
//         }
//     })

//     test('failed to create space ', async () => {
//         const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
//             "name": "Test Space",
//         })

//         expect(response.status).toBe(400);

//     }, {
//         headers: {
//             authorization: `Bearer ${userToken}`
//         }
//     })

//     test('test for can\'t delete space ', async () => {
//         const response = await axios.delete(`${BACKEND_URL}/api/v1/space/randomeId`)

//         expect(response.status).toBe(400);

//     }, {
//         headers: {
//             authorization: `Bearer ${userToken}`
//         }
//     })
//     test('test to delete space ', async () => {
//         const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
//             "name": "Test Space",
//             "dimension": "100x200",
//             "mapId": mapId,
//         }, {
//             headers: {
//                 authorization: `Bearer ${userToken}`
//             }
//         }
//         )
//         const deleteSpaceResponse = await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`)

//         expect(deleteSpaceResponse.status).toBe(200);

//     }, {
//         headers: {
//             authorization: `Bearer ${userToken}`
//         }
//     })

//     test('cannot delete other\'s test', async () => {
//         const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
//             "name": "Test Space 2",
//             "dimension": "100x200",
//             "mapId": mapId,
//         }, {
//             headers: {
//                 authorization: `Bearer ${userToken}`
//             }
//         }
//         )
//         const deleteSpaceResponse = await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`)

//         expect(deleteSpaceResponse.status).toBe(400);

//     }, {
//         headers: {
//             authorization: `Bearer ${token}`
//         }
//     })

//     test('Admin\'s initial space ', async () => {
//         const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`);
//         expect(response.data.spaces.length).toBe(0)
//     })
//     test('Admin\'s space ', async () => {
//         const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
//             "name": "Test Space",
//             "dimension": "100x200",
//             "mapId": mapId,
//         }, {
//             headers: {
//                 authorization: `Bearer ${token}`
//             }
//         })
//         const spaceResponse = await axios.get(`${BACKEND_URL}/api/v1/space/all`);
//         const filteredResponse = spaceResponse.find(x => x.id == response.data.spaceId)
//         expect(spaceResponse.data.spaces.length).toBe(1);
//         expect(filteredResponse.data.spaces).toBeDefined();
//     })

// })

// describe('Arena Endpoints', () => {
//     let token;
//     let adminId;
//     let userId;
//     let userToken;
//     let mapId;
//     let element1Id;
//     let element2Id;
//     let spaceId;

//     beforeAll(async () => {

//         test("Sign in as Admin", async () => {
//             const username = "Swayam" + Math.random();
//             const password = "123456";

//             const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
//                 username,
//                 password,
//                 type: "Admin"
//             })
//             expect(signupResponse.status).toBe(200) //signedup
//             adminId = signupResponse.data.userId;

//             const signinResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
//                 username,
//                 password
//             })
//             expect(signinResponse.data.token).toBeDefined();
//             token = signinResponse.data.token;

//             const element1Response = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
//                 'imageUrl': 'https://images.pexels.com/photos/7849511/pexels-photo-7849511.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//                 'width': 2,
//                 'height': 2,
//                 'static': 'true'
//             }, {
//                 headers: {
//                     authorization: `Bearer ${token}`
//                 }
//             })
//             const element2Response = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
//                 'imageUrl': 'https://images.pexels.com/photos/7849511/pexels-photo-7849511.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//                 'width': 2,
//                 'height': 2,
//                 'static': 'true'
//             }, {
//                 headers: {
//                     authorization: `Bearer ${token}`
//                 }
//             })

//             element1Id = element1Response.data.id;
//             element2Id = element2Response.data.id;

//             const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
//                 "thumbnail": "https://thumbnail.com/a.png",
//                 "dimensions": "100x200",
//                 "name": "Test space",
//                 "defaultElements": [{
//                     elementId: element1Id,
//                     x: 20,
//                     y: 20
//                 }, {
//                     elementId: element1Id,
//                     x: 18,
//                     y: 20
//                 }, {
//                     elementId: element2Id,
//                     x: 19,
//                     y: 20
//                 }
//                 ]
//             }, {
//                 headers: {
//                     authorization: `Bearer ${token}`
//                 }
//             })

//             mapId = mapResponse.data.id;


//         })

//         test("Sign in as user", async () => {
//             const username = "Swayam" + Math.random();
//             const password = "123456";

//             const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
//                 username,
//                 password,
//                 type: "user"
//             })
//             expect(signupResponse.status).toBe(200) //signedup
//             userId = signupResponse.data.userId;

//             const signinResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
//                 username,
//                 password
//             })
//             expect(signinResponse.data.token).toBeDefined();
//             userToken = signinResponse.data.token;


//         })
//     })
//     test('create space ', async () => {
//         const spaceResponse = await axios.post(`${BACKEND_URL}/api/v1/space`, {
//             "name": "Test Space",
//             "dimension": "100x200",
//             "mapId": mapId,
//         }, {
//             headers: {
//                 authorization: `Bearer ${userToken}`
//             }
//         })

//         expect(spaceResponse.data.spaceId).toBeDefined();
//         spaceId = spaceResponse.data.spaceId;

//     })

//     test('Non existing space', async () => {
//         const response = axios.get(`${BACKEND_URL}/api/v1/space/randomId`, {
//             headers: {
//                 authorization: `Bearer ${userToken}`
//             }
//         })

//         expect(response.status).toBe(400);

//     })

//     test('Get Existing space elements', async () => {
//         const response = axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
//             headers: {
//                 authorization: `Bearer ${userToken}`
//             }
//         })
//         expect(response.data.dimensions).toBe("100x200");
//         expect(response.data.elements.length).toBe(3)

//     })


//     test('Delete existing elements of a space', async () => {
//         const response = axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
//             headers: {
//                 authorization: `Bearer ${userToken}`
//             }
//         })

//         axios.delete(`${BACKEND_URL}/api/v1/space/element`, {
//             spaceId: spaceId,
//             elementId: response.data.elements[0].id,
//         })
//         const newResponse = axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
//             headers: {
//                 authorization: `Bearer ${userToken}`
//             }
//         })
//         expect(newResponse.data.elements.length).toBe(2)

//     })

//     test('Fail to Add elements in a space for random x,y', async () => {

//         const response = axios.post(`${BACKEND_URL}/api/v1/space/element`, {
//             "elementId": element1Id,
//             "spaceId": spaceId,
//             "x": 50000,
//             "y": 200010,
//         })
//         const newResponse = axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
//             headers: {
//                 authorization: `Bearer ${userToken}`
//             }
//         })
//         expect(newResponse.status).toBe(400)

//     })

//     test('Add elements in a space for correct x,y', async () => {

//         const response = axios.post(`${BACKEND_URL}/api/v1/space/element`, {
//             "elementId": element1Id,
//             "spaceId": spaceId,
//             "x": 50,
//             "y": 20,
//         })
//         const newResponse = axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
//             headers: {
//                 authorization: `Bearer ${userToken}`
//             }
//         })
//         expect(newResponse.data.elements.length).toBe(3)

//     })

// })


// describe('Admin endpoint', () => {
//     let token;
//     let adminId;
//     let userId;
//     let userToken;

//     beforeAll(async () => {

//         test("Sign in as Admin", async () => {
//             const username = "Swayam" + Math.random();
//             const password = "123456";

//             const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
//                 username,
//                 password,
//                 type: "Admin"
//             })
//             expect(signupResponse.status).toBe(200) //signedup
//             adminId = signupResponse.data.userId;

//             const signinResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
//                 username,
//                 password
//             })
//             expect(signinResponse.data.token).toBeDefined();
//             token = signinResponse.data.token;

//         })

//         test("Sign in as user", async () => {
//             const username = "Swayam" + Math.random();
//             const password = "123456";

//             const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
//                 username,
//                 password,
//                 type: "user"
//             })
//             expect(signupResponse.status).toBe(200) //signedup
//             userId = signupResponse.data.userId;

//             const signinResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
//                 username,
//                 password
//             })
//             expect(signinResponse.data.token).toBeDefined();
//             userToken = signinResponse.data.token;


//         })
//     })

//     test('User not able to hit admin endpoints', async () => {

//         const elementResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
//             'imageUrl': 'https://images.pexels.com/photos/7849511/pexels-photo-7849511.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//             'width': 2,
//             'height': 2,
//             'static': 'true'
//         }, {
//             headers: {
//                 authorization: `Bearer ${userToken}`
//             }
//         })
//         expect(elementResponse.status).toBe(403)

//         const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
//             "thumbnail": "https://thumbnail.com/a.png",
//             "dimensions": "100x200",
//             "name": "Test space",
//             "defaultElements": [
//             ]
//         }, {
//             headers: {
//                 authorization: `Bearer ${userToken}`
//             }
//         })
//         expect(mapResponse.status).toBe(403)

//         const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
//             "imageUrl": "https://images.pexels.com/photos/7849511/pexels-photo-7849511.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//             "name": "jadu"
//         }, {
//             headers: {
//                 authorization: `Bearer ${userToken}`
//             }
//         })
//         expect(avatarResponse.status).toBe(403)

//         const updateElement = await axios.put(`${BACKEND_URL}/api/v1/admin/element/123`, {
//             "imageUrl": "https://images.pexels.com/photos/7849511/pexels-photo-7849511.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//         }, {
//             headers: {
//                 authorization: `Bearer ${userToken}`
//             }
//         })
//         expect(updateElement.status).toBe(403)

//     })

//     test('Admin able to hit admin endpoints', async () => {

//         const elementResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
//             'imageUrl': 'https://images.pexels.com/photos/7849511/pexels-photo-7849511.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//             'width': 2,
//             'height': 2,
//             'static': 'true'
//         }, {
//             headers: {
//                 authorization: `Bearer ${token}`
//             }
//         })

//         const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
//             "thumbnail": "https://thumbnail.com/a.png",
//             "dimensions": "100x200",
//             "name": "Test space",
//             "defaultElements": [
//             ]
//         }, {
//             headers: {
//                 authorization: `Bearer ${token}`
//             }
//         })

//         const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
//             "imageUrl": "https://images.pexels.com/photos/7849511/pexels-photo-7849511.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//             "name": "jadu"
//         }, {
//             headers: {
//                 authorization: `Bearer ${token}`
//             }
//         })



//         expect(elementResponse.status).toBe(200)
//         expect(mapResponse.status).toBe(200)
//         expect(avatarResponse.status).toBe(200)

//     })

//     test('Admin able to update element in a space', async () => {
//         const elementResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
//             'imageUrl': 'https://images.pexels.com/photos/7849511/pexels-photo-7849511.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//             'width': 2,
//             'height': 2,
//             'static': 'true'
//         }, {
//             headers: {
//                 authorization: `Bearer ${token}`
//             }
//         })

//         const updateElement = await axios.put(`${BACKEND_URL}/api/v1/admin/element/${elementResponse.data.id}`, {
//             "imageUrl": "https://images.pexels.com/photos/30095280/pexels-photo-30095280/free-photo-of-latte-art-in-a-cafe-setting.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//         }, {
//             headers: {
//                 authorization: `Bearer ${token}`
//             }
//         })

//         expect(updateElement.status).toBe(200)
//     })
// })

// describe('Websocket Tests', () => {
//     let token;
//     let adminId;
//     let userId;
//     let userToken;
//     let mapId;
//     let element1Id;
//     let element2Id;
//     let spaceId;
//     let ws1;
//     let ws2;
//     let ws1Messages = [];
//     let ws2Messages = [];
//     let userX;
//     let userY;
//     let adminX;
//     let adminY;

//     function waitForAndPopulateLatestMessage(inputArray) {
//         return new Promise(r => {
//             if (inputArray.length > 0) {
//                 resolve(inputArray.shift())
//             }
//             else {
//                 let interval = setInterval(() => {
//                     if (inputArray.length > 0) {
//                         resolve(inputArray.shift())
//                     }
//                 }, 100)
//             }
//         })
//     }

//     function HttpSetup() {
//         test("Sign in as Admin", async () => {
//             const username = "Swayam" + Math.random();
//             const password = "123456";

//             const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
//                 username,
//                 password,
//                 type: "Admin"
//             })
//             expect(signupResponse.status).toBe(200) //signedup
//             adminId = signupResponse.data.userId;

//             const signinResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
//                 username,
//                 password
//             })
//             expect(signinResponse.data.token).toBeDefined();
//             token = signinResponse.data.token;

//             const element1Response = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
//                 'imageUrl': 'https://images.pexels.com/photos/7849511/pexels-photo-7849511.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//                 'width': 2,
//                 'height': 2,
//                 'static': 'true'
//             }, {
//                 headers: {
//                     authorization: `Bearer ${token}`
//                 }
//             })
//             const element2Response = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
//                 'imageUrl': 'https://images.pexels.com/photos/7849511/pexels-photo-7849511.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//                 'width': 2,
//                 'height': 2,
//                 'static': 'true'
//             }, {
//                 headers: {
//                     authorization: `Bearer ${token}`
//                 }
//             })

//             element1Id = element1Response.data.id;
//             element2Id = element2Response.data.id;

//             const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
//                 "thumbnail": "https://thumbnail.com/a.png",
//                 "dimensions": "100x200",
//                 "name": "Test space",
//                 "defaultElements": [{
//                     elementId: element1Id,
//                     x: 20,
//                     y: 20
//                 }, {
//                     elementId: element1Id,
//                     x: 18,
//                     y: 20
//                 }, {
//                     elementId: element2Id,
//                     x: 19,
//                     y: 20
//                 }
//                 ]
//             }, {
//                 headers: {
//                     authorization: `Bearer ${token}`
//                 }
//             })

//             mapId = mapResponse.data.id;

//             const spaceResponse = await axios.post(`${BACKEND_URL}/api/v1/space`, {
//                 "name": "Nuketown",
//                 "dimension": "100x200",
//                 "mapId": mapId,
//             }, {
//                 headers: {
//                     authorization: `Bearer ${token}`
//                 }
//             })

//             expect(spaceResponse.data.spaceId).toBeDefined();
//             spaceId = spaceResponse.data.spaceId;


//         })

//         test("Sign in as user", async () => {
//             const username = "Swayam" + Math.random() + '-user';
//             const password = "123456";

//             const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
//                 username,
//                 password,
//                 type: "user"
//             })
//             expect(signupResponse.status).toBe(200) //signedup
//             userId = signupResponse.data.userId;

//             const signinResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
//                 username,
//                 password
//             })
//             expect(signinResponse.data.token).toBeDefined();
//             userToken = signinResponse.data.token;


//         })

//     }
//     async function wsSetup() {
//         ws1 = new WebSocket(WS_URL);

//         await new Promise(r => {
//             ws1.onOpen = r;
//         })
//         ws1.onmessage = (event) => {
//             ws1Messages.push(JSON.parse(event.data))
//         }


//         ws2 = new WebSocket(WS_URL);
//         await new Promise(r => {
//             ws2.onOpen = r;
//         })

//         ws2.onmessage = (event) => {
//             ws2Messages.push(JSON.parse(event.data))
//         }

//     }

//     beforeAll(() => {
//         HttpSetup();
//         wsSetup();

//     })

//     test('Get ack for joining the space', async () => {
//         ws1.send(JSON.stringify({
//             "type": "join",
//             "payload": {
//                 "spaceId": spaceId,
//                 "token": token,
//             }
//         }))
//         const message1 = await waitForAndPopulateLatestMessage(ws1Messages);

//         ws2.send(JSON.stringify({
//             "type": "join",
//             "payload": {
//                 "spaceId": spaceId,
//                 "token": userToken,
//             }
//         }))

//         const message2 = await waitForAndPopulateLatestMessage(ws2Messages);
//         const message3 = await waitForAndPopulateLatestMessage(ws1Messages);

//         expect(message1.type).toBe("space-joined")
//         expect(message1.payload.users.length).toBe(0)

//         expect(message2.type).toBe("space-joined")
//         expect(message2.payload.users.length).toBe(1)

//         expect(message3.type).toBe("user-join")
//         expect(message3.payload.userId).toBe(userId)
//         expect(message3.payload.x).toBe(message2.payload.spawn.x)
//         expect(message3.payload.y).toBe(message2.payload.spawn.y)

//         adminX = message1.payload.spawn.x;
//         adminY = message1.payload.spawn.y;

//         userX = message2.payload.spawn.x;
//         userY = message2.payload.spawn.y;
//     })

//     test('Movement Wall Limit', async () => {
//         ws1.send(JSON.stringify({
//             type: "move",
//             payload: {
//                 x: 100000,
//                 y: 100000,
//             }
//         }));
//         const message = await waitForAndPopulateLatestMessage(ws1Messages);
//         expect(message.type).toBe("movement-rejected");
//         expect(message.payload.x).toBe(adminX);
//         expect(message.payload.y).toBe(adminY);
//     })
//     test('Movement Jump Limit', async () => {
//         ws1.send(JSON.stringify({
//             type: "move",
//             payload: {
//                 x: x + 2,
//                 y: 100000,
//             }
//         }));
//         const message = await waitForAndPopulateLatestMessage(ws1Messages);
//         expect(message.type).toBe("movement-rejected");
//         expect(message.payload.x).toBe(adminX);
//         expect(message.payload.y).toBe(adminY);
//     })
//     test('Correct Movement goes Out', async () => {
//         ws1.send(JSON.stringify({
//             type: "move",
//             payload: {
//                 x: adminX + 1,
//                 y: adminY,
//                 userId: adminId,
//             }
//         }));
//         const message = await waitForAndPopulateLatestMessage(ws1Messages);
//         expect(message.type).toBe("movement");
//         expect(message.payload.x).toBe(adminX + 1);
//         expect(message.payload.y).toBe(adminY);
//     })

//     test('User leaves the space', async () => {
//         ws1.close();
//         const message = await waitForAndPopulateLatestMessage(ws2Messages);
//         expect(message.type).toBe("user-left");
//         expect(message.payload.userId).toBe(adminId);
//     })
// })