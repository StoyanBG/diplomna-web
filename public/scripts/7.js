// Predefined bus schedule in HH:MM format
const busSchedule = ['06:05', '06:20', '06:35', '06:50', '07:05', '07:20', '07:35', '07:50', '08:05', '08:20', '08:35',
    '08:50', '09:05', '09:20', '09:35', '09:50', '10:05', '10:20', '10:35', '10:50', '11:05', '11:20', '11:35', '11:50', '12:05',
    '12:20', '12:35', '12:50', '13:05', '13:20', '13:35', '13:50', '14:05', '14:20', '14:35', '14:50', '15:05', '15:20', '15:35',
    '15:50', '16:05', '16:20', '16:35', '16:50', '17:05', '17:20', '17:35', '17:50', '18:05', '18:20', '18:35', '18:50', '19:05',
    '19:20', '19:35', '19:50', '20:10', '20:25', '20:45', '21:25'];

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
    } 
    else {
        document.getElementById('result').textContent = 'Няма повече автобуси днес.';
    }
}
var map = L.map('map').setView([42.1354, 24.7453], 13);

// Add the OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Define the bus route (example coordinates)
var busRoute = [[42.16674085415755,24.77608213178666,0],
    [42.16669908923821,24.77629360893982,0],
    [42.1668480933046,24.77626839937842,0],
    [42.16686314541115,24.7759577765052,0],
    [42.16656157588524,24.77528976817589,0],
    [42.16533699340541,24.77504753235858,0],
    [42.16499606600321,24.77461461034982,0],
    [42.16406367431386,24.77385913455706,0],
    [42.16374904176634,24.77230767082713,0],
    [42.16047974627631,24.76658477961357,0],
    [42.1594430082839,24.7577613239965,0],
    [42.15933309313763,24.74842598252377,0],
    [42.15272970954026,24.75025708424049,0],
    [42.1506768161946,24.75017825999967,0],
    [42.1456647853308,24.75127967029322,0],
    [42.1414820616387,24.75158834922082,0],
    [42.13633636577392,24.75217367289023,0],
    [42.13328108586816,24.73180133603869,0],
    [42.13317053675534,24.72832237666793,0],
    [42.1324444254161,24.72555195470867,0],
    [42.13144555701793,24.72442282144192,0],
    [42.1290258490929,24.72256685521672,0],
    [42.12458283353138,24.73890862133469,0],
    [42.11930803111652,24.73563438610258,0],
    [42.11790090498818,24.7351051693771,0],
    [42.11598351675331,24.73324352725964,0],
    [42.11355854155271,24.73197349398531,0],
    [42.1125653345993,24.73564604231316,0],
    [42.1123952807059,24.74020699299303,0],
    [42.11259536423687,24.74022704886652,0],
    [42.11247474735335,24.73922053416353,0],
    [42.11269522753623,24.73567957356525,0],
    [42.11359758092583,24.73222475810001,0],
    [42.11591702166007,24.73339986606592,0],
    [42.11778165211889,24.73529395152332,0],
    [42.1192784286915,24.735870257492,0],
    [42.1245874986657,24.73920717433896,0],
    [42.12647542534175,24.73336084381723,0],
    [42.1291237763828,24.72289707721192,0],
    [42.13240027494108,24.72571556573839,0],
    [42.13305889319981,24.72884507973887,0],
    [42.13316080423262,24.73183053673829,0],
    [42.13617967424145,24.75281039669218,0],
    [42.13652130083229,24.75245164968675,0],
    [42.14586562517336,24.75171743657621,0],
    [42.15075708366965,24.7504680819411,0],
    [42.15270238362157,24.75061629345105,0],
    [42.159100128261,24.74897532063637,0],
    [42.15918193462299,24.75777297301318,0],
    [42.16004322932422,24.76659391332378,0],
    [42.16348873158218,24.77238787460339,0],
    [42.16395880403037,24.77386436574462,0],
    [42.1652732170437,24.77510750118973,0],
    [42.16648915873199,24.77538519315253,0],
    [42.16666871729034,24.77559869781966,0],
    [42.16674085415755,24.77608213178666,0]
];


// Create a polyline for the bus route and add it to the map
L.polyline(busRoute, {color: 'red'}).addTo(map);
