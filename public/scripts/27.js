 // Predefined bus schedule in HH:MM format
 const busSchedule = ["05:30", "05:42", "05:54", "06:06", '06:16', '06:28', '06:40', '06:52', '07:04', '07:16', '07:28', 
    '07:40', '07:52', '08:04', '08:16', '08:28', '08:40', '08:52', '09:04', '09:16', '09:28', '09:40', '09:52', '10:04', 
    '10:16', '10:28', '10:40', '10:52', '11:04', '11:16', '11:28', '11:40', '11:52', '12:04', '12:16', '12:28', '12:40', 
    '12:52', '13:04', '13:16', '13:28', '13:40', '13:52', '14:04', '14:16', '14:28', '14:40', '14:52', '15:04', '15:16', 
    '15:28', '15:40', '15:52', '16:04', '16:16', '16:28', '16:40', '16:52', '17:04', '17:16', '17:28', '17:40', '17:52', 
    '18:04', '18:16', '18:28', '18:40', '18:52', '19:04', '19:16', '19:28', '19:40', '19:52', '20:04', '20:16', '20:28', 
    ,"21:16","21:53"];

    // Function to find the next bus
    function findNextBus() {
        const userTimeInput = document.getElementById('userTime').value;

        if (!userTimeInput) {
            document.getElementById('result').textContent = 'Моля въведете валидно време.';
            return;
        }

        const nextBus = busSchedule.find(busTime => busTime >= userTimeInput);

        if (nextBus) {
            document.getElementById('result').textContent = `Следващия автобус е в ${nextBus}.`;
        } else {
            document.getElementById('result').textContent = 'Няма повече автобуси днес.';
        }
    }
    var map = L.map('map').setView([42.1354, 24.7453], 13);

    // Add the OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Define the bus route (example coordinates)
var busRoute = [[42.15678989982429,24.76978148366382,0],
    [42.15667024569643,24.76980569721484,0],
    [42.15668450317045,24.77007830800638,0],
    [42.15686675212468,24.77068616523735,0],
    [42.15720657431154,24.77158130144091,0],
    [42.15817758216337,24.77328018970888,0],
    [42.15963484716408,24.77184748832139,0],
    [42.16025714928116,24.77121984625995,0],
    [42.16141425414771,24.7708867819886,0],
    [42.16236628406375,24.76995459747456,0],
    [42.16043557453564,24.76636313600772,0],
    [42.16027750414737,24.76430004228764,0],
    [42.15943841786512,24.75760011817727,0],
    [42.15932509824593,24.74922731159849,0],
    [42.15934041778861,24.74834700335153,0],
    [42.15482930822927,24.74966165219602,0],
    [42.15252821022968,24.7502115533675,0],
    [42.15077951227732,24.75013392287914,0],
    [42.14628152823864,24.75114625981468,0],
    [42.14301093293929,24.75155852737565,0],
    [42.13629742852802,24.75217779978452,0],
    [42.13342745339897,24.7560981652678,0],
    [42.13207375818067,24.75513371863483,0],
    [42.12995641931488,24.75515048685122,0],
    [42.12872541740897,24.75638016760141,0],
    [42.12724808959933,24.75730845905488,0],
    [42.12602171837324,24.75762067622383,0],
    [42.12656651153696,24.74196089788483,0],
    [42.1240459608461,24.74069056947147,0],
    [42.12650948958569,24.7329282890487,0],
    [42.12909149351935,24.72259112223873,0],
    [42.12497969254324,24.71944393275568,0],
    [42.10821755230209,24.70662009292251,0],
    [42.10165204735436,24.7032496253152,0],
    [42.10045911344891,24.70209352461941,0],
    [42.10031658972866,24.70226240445968,0],
    [42.10053480573691,24.70258229626055,0],
    [42.10069404920375,24.70245751661349,0],
    [42.10157460560411,24.70340082730059,0],
    [42.10817307469073,24.7069008574031,0],
    [42.12883199299972,24.72281651661051,0],
    [42.12626909709343,24.73280147825328,0],
    [42.12358645692832,24.74108624295377,0],
    [42.138654745134,24.75194343870832,0],
    [42.13651471847096,24.7521289344077,0],
    [42.13620341532493,24.75160087869963,0],
    [42.1354976369262,24.74527527517231,0],
    [42.13522103305068,24.74503505450969,0],
    [42.13159341296916,24.74489356251419,0],
    [42.12411900637201,24.74080325747046,0],
    [42.12478607232823,24.73887947700516,0],
    [42.12618240818234,24.7423921588235,0],
    [42.12569122666067,24.75792799189141,0],
    [42.12715763057142,24.75756928195837,0],
    [42.13059118630231,24.75532909525661,0],
    [42.132339032037,24.75552195197169,0],
    [42.13361515313505,24.75728431537738,0],
    [42.13354761306294,24.75791874881636,0],
    [42.13306113574642,24.75840020229231,0],
    [42.132680358945,24.75829070010643,0],
    [42.13292189452715,24.75713445286967,0],
    [42.13668646321263,24.75239672301179,0],
    [42.14640155697776,24.75142607225821,0],
    [42.15082148784125,24.7504566573627,0],
    [42.15258526200112,24.75070367400888,0],
    [42.15895363360971,24.74895999918522,0],
    [42.12650948958569,24.7329282890487,0],
    [42.12909149351935,24.72259112223873,0],
    [42.12497969254324,24.71944393275568,0],
    [42.10821755230209,24.70662009292251,0],
    [42.10165204735436,24.7032496253152,0],
    [42.10045911344891,24.70209352461941,0],
    [42.10031658972866,24.70226240445968,0],
    [42.10053480573691,24.70258229626055,0],
    [42.10069404920375,24.70245751661349,0],
    [42.10157460560411,24.70340082730059,0],
    [42.10817307469073,24.7069008574031,0],
    [42.12883199299972,24.72281651661051,0],
    [42.12626909709343,24.73280147825328,0],
    [42.12358645692832,24.74108624295377,0],
    [42.15933659732705,24.75873533761782,0],
    [42.15987375225944,24.76595000780055,0],
    [42.16183138456787,24.7698359086904,0],
    [42.16123271670447,24.77050757157126,0],
    [42.16005875947967,24.77076728871896,0],
    [42.15819240558602,24.77275398372325,0],
    [42.15741190822771,24.77144003592377,0],
    [42.15681293627688,24.77042230389927,0],
    [42.15688873772309,24.76998841223642,0],
    [42.15678989982429,24.76978148366382,0]];


// Create a polyline for the bus route and add it to the map
L.polyline(busRoute, {color: 'red'}).addTo(map);
