
const busSchedule = ['05:50', '06:00', '06:10', '06:20', '06:30', '06:40', '06:50', '07:00', '07:10', '07:20', '07:30',
    '07:40', '07:50', '08:00', '08:10', '08:20', '08:30', '08:40', '08:50', '09:00', '09:10', '09:20', '09:30', '09:40', '09:50',
    '10:00', '10:10', '10:20', '10:30', '10:40', '10:50', '11:00', '11:10', '11:20', '11:30', '11:40', '11:50', '12:00', '12:10',
    '12:20', '12:30', '12:40', '12:50', '13:00', '13:10', '13:20', '13:30', '13:40', '13:50', '14:00', '14:10', '14:20', '14:30',
    '14:40', '14:50', '15:00', '15:10', '15:20', '15:30', '15:40', '15:50', '16:00', '16:10', '16:20', '16:30', '16:40', '16:50',
    '17:00', '17:10', '17:20', '17:30', '17:40', '17:50', '18:00', '18:10', '18:20', '18:30', '18:40', '18:50', '19:00', '19:10',
    '19:20', '19:30', '19:40', '19:50', '20:00', '20:10', '20:20', '20:30', '20:40', '20:50', '21:00', '21:10',"21:25"];

     
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
 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


var busRoute = [[42.18563750933062,24.73774770870338,0],
    [42.18591768065376,24.73777261200846,0],
    [42.18596494791406,24.73712930640197,0],
    [42.18436412333736,24.73749903114709,0],
    [42.17788888559344,24.74099108368823,0],
    [42.17506518289117,24.74167040594183,0],
    [42.16285627041648,24.74306197934902,0],
    [42.16290096622256,24.74704143644311,0],
    [42.16256558616025,24.74737619426695,0],
    [42.15948181709265,24.74856737952226,0],
    [42.1523775734841,24.7504316626195,0],
    [42.15121026796778,24.75015128431829,0],
    [42.14924064111719,24.75037254409854,0],
    [42.14590792890659,24.75125629656603,0],
    [42.14367417250466,24.75141865116839,0],
    [42.13704669870596,24.7521004503085,0],
    [42.13653194852369,24.75214370408941,0],
    [42.13627349018849,24.7517092223159,0],
    [42.1354735161358,24.74517919369119,0],
    [42.13388594369528,24.74504786482316,0],
    [42.13126174411268,24.74477299082354,0],
    [42.13035448086418,24.74418541019993,0],
    [42.12941240169098,24.7414801996666,0],
    [42.11952769482694,24.73570006570368,0],
    [42.12155581321975,24.7303986927167,0],
    [42.12648204688648,24.73355835920595,0],
    [42.12906317080864,24.72265494456769,0],
    [42.10825907832251,24.70652340676273,0],
    [42.10183293124147,24.70340461214269,0],
    [42.10044213008715,24.70213193426281,0],
    [42.10033261058466,24.7023006459203,0],
    [42.10048907604605,24.70254574986106,0],
    [42.10072131382321,24.70253794327029,0],
    [42.1017965390386,24.70350329383269,0],
    [42.10815647235663,24.70674098268509,0],
    [42.12864225079866,24.72286742135549,0],
    [42.1262810168433,24.73303192574659,0],
    [42.12124137642899,24.72981054345121,0],
    [42.11879755228552,24.73631059864253,0],                        
    [42.12451919554235,24.73906357436449,0],
    [42.12406443017677,24.74074351286059,0],
    [42.13031531864809,24.74429073321726,0],
    [42.13129212021833,24.74496813765875,0],
    [42.13521969300762,24.74532130312648,0],
    [42.13626055847169,24.75284178469689,0],
    [42.1371893,24.7522446,0],
    [42.14591602516207,24.75167510346317,0],
    [42.14935087190675,24.75073420025251,0],
    [42.1512572073743,24.75056011440535,0],       
    [42.15236123443741,24.75079406946406,0],
    [42.15953545906957,24.7489367854678,0],
    [42.16273481673184,24.74760070058157,0],
    [42.16315986569741,24.74771318987467,0],
    [42.16304813021542,24.74337421870053,0],
    [42.17506234388978,24.74209742551282,0],
    [42.17801827604381,24.74138391723354,0],
    [42.1850473392835,24.73745210297556,0],
    [42.18563750933062,24.73774770870338,0]];
L.polyline(busRoute, {color: 'red'}).addTo(map);
