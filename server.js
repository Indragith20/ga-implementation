const express = require('express');
const bodyparser = require('body-parser');
const fs = require('fs');
const cors = require('cors')

const app = express();
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended:true
}));


app.get('/', function (req, res) {
    res.send('Hello Dev!');
});

/* app.post('/savedata', (req, res) => {
    console.log(req.body);
    //const requestBody = JSON.parse(req.body);
    const previousPath = req.body.previousPath;
    const nextPath = req.body.nextPath;
    fs.readFile('routes.json', 'utf8', (err, data) => {
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data);
        console.log(obj);
        if(obj.routes.length === 0) {
            const { newJsonForPreviousPath, newJsonForNextPath } = insertNewRow(previousPath, nextPath);
            obj.routes.push(newJsonForPreviousPath,newJsonForNextPath);
        } else {
            const currentRoutes = obj.routes;
            let routeMatchKey = '';
            let nextMatchKey = '';
            const matchingRoutesArray = currentRoutes.filter((existingRoute) => {
                let matchFound = false;
                Object.keys(existingRoute).map((routeKey) => {
                    console.log(routeKey);
                    if(routeKey === previousPath) {
                        routeMatchKey = routeKey;
                        matchFound = true;
                    } else if(routeKey === nextPath) {
                        nextMatchKey = routeKey;
                    }
                })
                return matchFound;
            });
            const matchingRoutes = matchingRoutesArray[0];
            if(matchingRoutes && routeMatchKey !== '') {
                let matchFound = false;
                Object.keys(matchingRoutes[routeMatchKey]).map((matchKey) => {
                    if(matchKey === nextPath) {
                        matchFound = true;
                        matchingRoutes[routeMatchKey][matchKey] = matchingRoutes[routeMatchKey][matchKey] + 1;
                    }
                })
                if(!matchFound) {
                    matchingRoutes[routeMatchKey][nextPath] = 1;
                    if(nextMatchKey === '') {
                        const newJsonForNextPath = {};
                        newJsonForNextPath[nextPath] = {};
                        obj.routes.push(newJsonForNextPath);
                    }
                }
            } else if(routeMatchKey === '' && nextMatchKey === '') {
                const { newJsonForPreviousPath, newJsonForNextPath } = insertNewRow(previousPath, nextPath);
                obj.routes.push(newJsonForPreviousPath,newJsonForNextPath);
            } else if(routeMatchKey === '') {
                const newJsonForPreviousPath = {};
                newJsonForPreviousPath[previousPath] = {
                    [nextPath]: 1
                };
                obj.routes.push(newJsonForPreviousPath);
            }
        }
        
        const modifiedjson = JSON.stringify(obj);
        fs.writeFile('routes.json', modifiedjson, 'utf8', (err, data) => {
            if(err) {
                res.json({error: 'error'}).status(200);
            }
            res.json({success: 'sucess'}).status(200);
        }); 
    }});
}); */

app.post('/savedata', (req, res) => {
    console.log(req.body);
    //const requestBody = JSON.parse(req.body);
    const previousPath = req.body.previousPath;
    const nextPath = req.body.nextPath;
    fs.readFile('routes.json', 'utf8', (err, data) => {
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data);
        console.log(obj);
        if(obj.routes.length === 0) {
            const { newJsonForPreviousPath, newJsonForNextPath } = insertNewRow(previousPath, nextPath);
            obj.routes.push(newJsonForPreviousPath,newJsonForNextPath);
        } else {
            const currentRoutes = obj.routes;
            let routeMatchKey = '';
            let nextMatchKey = '';
            const matchingRoutesArray = currentRoutes.filter((existingRoute) => {
                let matchFound = false;
                Object.keys(existingRoute).map((routeKey) => {
                    console.log(routeKey);
                    if(routeKey === previousPath) {
                        routeMatchKey = routeKey;
                        matchFound = true;
                    } else if(routeKey === nextPath) {
                        nextMatchKey = routeKey;
                    }
                })
                return matchFound;
            });
            const matchingRoutes = matchingRoutesArray[0];
            console.log('Matching Routes');
            console.log(JSON.stringify(matchingRoutes));
            if(matchingRoutes && routeMatchKey !== '') {
                let matchFound = false;
                matchingRoutes[routeMatchKey].map((inRoute) => {
                    Object.keys(inRoute).map((matchKey) => {
                        if(matchKey === nextPath) {
                            matchFound = true;
                            inRoute[matchKey] = inRoute[matchKey] + 1;
                        }
                    })
                })
                if(!matchFound) {
                    const newPath = {
                        [nextPath]: 1
                    };
                    matchingRoutes[routeMatchKey].push(newPath);
                    if(nextMatchKey === '') {
                        const newJsonForNextPath = {};
                        newJsonForNextPath[nextPath] = [];
                        obj.routes.push(newJsonForNextPath);
                    }
                }
            } else if(routeMatchKey === '' && nextMatchKey === '') {
                const { newJsonForPreviousPath, newJsonForNextPath } = insertNewRow(previousPath, nextPath);
                obj.routes.push(newJsonForPreviousPath,newJsonForNextPath);
            } else if(routeMatchKey === '') {
                const newJsonForPreviousPath = {};
                newJsonForPreviousPath[previousPath] = [];
                const newPath = {
                    [nextPath]: 1
                };
                newJsonForPreviousPath[previousPath].push(newPath);
                obj.routes.push(newJsonForPreviousPath);
            }
        }
        
        const modifiedjson = JSON.stringify(obj);
        fs.writeFile('routes.json', modifiedjson, 'utf8', (err, data) => {
            if(err) {
                res.json({error: 'error'}).status(200);
            }
            res.json({success: 'sucess'}).status(200);
        }); 
    }});
});

app.get('/getData', (req, res) => {
    fs.readFile('routes.json', (err, data) => {
        if(err) {
            res.json({error: 'error'}).status(200);
        }
        const originalRouteData = JSON.parse(data);
        const routeData = originalRouteData.routes;
        const modifiedRouteData = routeData.map((route) => {
            Object.keys(route).map((visitedUrl) => {
               const maxVisited = Object.keys(visitedUrl).reduce((prev, next) => {
                    if(visitedUrl[prev] > visitedUrl[next]) {
                        return visitedUrl[prev];
                    }
                    return visitedUrl[next];
                }, 0);
                console.log(maxVisited)
                return {
                    [routeData[route]] : maxVisited
                };
            })
        })
        console.log(modifiedRouteData);
        res.json({routeData}).status(200);
    })
})

/* function insertNewRow(previousPath, nextPath) {
    const newJsonForPreviousPath = {};
    newJsonForPreviousPath[previousPath] = {
        [nextPath]: 1
    };
    const newJsonForNextPath = {};
    newJsonForNextPath[nextPath] = {};
    return {
        newJsonForPreviousPath,
        newJsonForNextPath
    };
}
 */
function insertNewRow(previousPath, nextPath) {
    const newJsonForPreviousPath = {};
    newJsonForPreviousPath[previousPath] = [];
    const newPath = {
        [nextPath]: 1
    };
    newJsonForPreviousPath[previousPath].push(newPath);
    const newJsonForNextPath = {};
    newJsonForNextPath[nextPath] = [];
    return {
        newJsonForPreviousPath,
        newJsonForNextPath
    };
}

app.listen(9000, () => {
    console.log('Listening...');
})