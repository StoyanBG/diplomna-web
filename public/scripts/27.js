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
var busRoute = [[42.15699364132607,24.7699760236477,0],
    [42.15666076473236,24.76972660635252,0],
    [42.15663086859022,24.7704414025408,0],
    [42.15724294229478,24.77142915580142,0],
    [42.15750123419711,24.77229363071646,0],
    [42.15820898704285,24.77322072370895,0],
    [42.16062395367108,24.77100298544758,0],
    [42.16208875923198,24.77055103278994,0],
    [42.16240775496492,24.76983842151361,0],
    [42.16112912092474,24.76766088292707,0],
    [42.16060648305491,24.76656831835018,0],
    [42.16037939901079,24.76561232267174,0],
    [42.15953527258782,24.75873277343068,0],
    [42.15929186929683,24.74854324301107,0],
    [42.15193947258745,24.75028521826546,0],
    [42.15070574586015,24.75003505898035,0],
    [42.14858498464266,24.75059344301558,0],
    [42.14555587820968,24.75126766280544,0],
    [42.14318729250474,24.7512824021832,0],
    [42.13639799902106,24.75204894916179,0],
    [42.13593838117809,24.74870355810174,0],
    [42.13555201094471,24.7454888083911,0],
    [42.13538624301913,24.74496754109775,0],
    [42.13164397409767,24.74470900317624,0],
    [42.12427052939709,24.74086746949892,0],
    [42.12649788391006,24.73374046614446,0],
    [42.12772687961632,24.72791959193638,0],
    [42.12925884675255,24.72256927231503,0],
    [42.10966153483606,24.70741554958965,0],
    [42.10717393328247,24.70574746286428,0],
    [42.10293916654351,24.70369756975688,0],
    [42.10148012460927,24.70307841305929,0],
    [42.10027709303374,24.70178948933298,0],
    [42.10023842792652,24.70219546203959,0],
    [42.10061227506262,24.7026223608634,0],
    [42.10092606719366,24.70269163257601,0],
    [42.10149899272772,24.7033898361615,0],
    [42.10579694232876,24.70534869717863,0],
    [42.10959189684252,24.70761076564817,0],
    [42.1289886249354,24.72283229823526,0],
    [42.12755721600322,24.72777107496504,0],
    [42.12620721922211,24.73379109098818,0],
    [42.12400355337025,24.74093751412384,0],
    [42.13165299492853,24.7449136668559,0],
    [42.13516058417131,24.74509059216683,0],
    [42.1352596041829,24.74524496137278,0],
    [42.13531045657501,24.74598445398875,0],
    [42.13630389587345,24.75254715279324,0],
    [42.14470109387664,24.75163549128122,0],
    [42.14567617352456,24.75164300071917,0],
    [42.14738085492287,24.75115431292615,0],
    [42.15106912070068,24.75055273568451,0],
    [42.15210221770908,24.75070786555135,0],
    [42.1590218396145,24.74907417032201,0],
    [42.15925843110497,24.75881738161717,0],
    [42.16004706957261,24.7663287152249,0],
    [42.16195903188312,24.76957781138567,0],
    [42.16207460369394,24.77008164701349,0],
    [42.1606307909725,24.77047739881348,0],
    [42.15818355241248,24.77272054932576,0],
    [42.15771431394859,24.77210218592877,0],
    [42.15723530157349,24.7711290819231,0],
    [42.15699364132607,24.7699760236477,0]];


// Create a polyline for the bus route and add it to the map
L.polyline(busRoute, {color: 'red'}).addTo(map);
