// Predefined bus schedule in HH:MM format
const busSchedule = ["05:15", "05:45", '06:15', '06:30', '06:45', '07:00', '07:15', '07:30',
    '07:45', '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', 
    '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', 
    '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', 
    '16:00', '16:15', '16:30', '16:45', '17:00', '17:25',"17:40","18:20","18:50","19:35","20:00,","20:45"];

     // Function to find the next bus
     function findNextBus() {
         const userTimeInput = document.getElementById('userTime').value;

         if (!userTimeInput) {
             document.getElementById('result').textContent = 'Please enter a valid time.';
             return;
         }

         const nextBus = busSchedule.find(busTime => busTime >= userTimeInput);

         if (nextBus) {
             document.getElementById('result').textContent = `The next bus is at ${nextBus}.`;
         } else {
             document.getElementById('result').textContent = 'No more buses today.';
         }
     }
     var map = L.map('map').setView([42.1354, 24.7453], 13);

     // Add the OpenStreetMap tile layer
     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
     }).addTo(map);

     // Define the bus route (example coordinates)
     var busRoute = [
     [42.16247359637361, 24.75823848422519],
[42.16277486893667, 24.75694006618063],
[42.16277110595848, 24.75642101571258],
[42.16329377516143, 24.75553150133331],
[42.16306404288986, 24.74776590759544],
[42.16088336820035, 24.74814719581578],
[42.15866546612861, 24.74889332384739],
[42.15832908796772, 24.74895927137985],
[42.15874433027564, 24.74301288487713],
[42.15902040820335, 24.74108343968987],
[42.15849415525739, 24.73904984648644],
[42.15508949768275, 24.73950777186062],
[42.15411417813063, 24.73954274214179],
[42.15224842135834, 24.73988555793294],
[42.15026289267964, 24.74128171248449],
[42.14123654067961, 24.74260944194943],
[42.13601786799202, 24.74345857175166],
[42.13398909593977, 24.74179221173067],
[42.13318243780714, 24.73329181577039],
[42.13224876756294, 24.72628250340864],
[42.13092921851451, 24.72440113849992],
[42.12537083195456, 24.72025157170612],
[42.12524225333446, 24.72058237761703],
[42.12510319449986, 24.7206903807027],
[42.12516320725539, 24.72027736987698],
[42.1253528307292, 24.72001130484234],
[42.13076878506718, 24.72384062810536],
[42.13236698254228, 24.72551361936243],
[42.13327691817978, 24.73250979972089],
[42.13465397580529, 24.73866731696108],
[42.13438043105177, 24.74163121714525],
[42.1356856248544, 24.74221624908654],
[42.13731918679219, 24.74232976358941],
[42.14178020455843, 24.74180486283567],
[42.14866235660083, 24.7408195638411],
[42.1501791791025, 24.74054704254749],
[42.15135135664936, 24.7393573188553],
[42.15270790444719, 24.73867977240226],
[42.15727477811072, 24.73813343464367],
[42.15909973494625, 24.73786385539594],
[42.15947211934046, 24.74096460703339],
[42.1593370056918, 24.74706624018409],
[42.15943200147787, 24.75424312574494],
[42.1595340193786, 24.75568259369955],
[42.15935566056575, 24.75763663781013],
[42.1597837288738, 24.75987217472897],
[42.16036901059979, 24.76002688422259],
[42.16083029146568, 24.75984465179492],
[42.16183988599666, 24.76003487875456],
[42.16202778003069, 24.75999736265545],
[42.16213329216057, 24.75952067689745],
[42.16247359637361, 24.75823848422519]

];


     // Create a polyline for the bus route and add it to the map
     L.polyline(busRoute, {color: 'red'}).addTo(map);
     document.getElementById('main-page-button').addEventListener('click', function(event) {
           event.preventDefault(); // Prevent the default anchor click behavior

           // Check authentication status
           fetch('/check-auth')
               .then(response => response.json())
               .then(data => {
                   if (data.isAuthenticated) {
                       // Redirect to success.html if authenticated
                       window.location.href = '/cl.html';
                   } else {
                       // Redirect to login.html if not authenticated
                       window.location.href = '/login.html';
                   }
               })
               .catch(error => {
                   console.error('Error checking authentication:', error);
                   // Handle error, maybe redirect to login or show a message
                   window.location.href = '/login.html';
               });
       });