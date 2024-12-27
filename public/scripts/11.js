 // Predefined bus schedule in HH:MM format
 const busSchedule = ["05:30", "06:05", "06:18", "06:31", "06:44", "06:57","07:10","07:22","07:34", "07:48", "08:00", "08:12", "08:24",
    "08:36", "08:48", "09:00", "09:12", "09:24", "09:36", "09:48", "10:00", "10:12", "10:24", "10:36", "10:48", "11:00", "11:12",
    "11:24", "11:36", "11:48", "12:00", "12:12", "12:24", "12:36", "12:48", "13:00", "13:12", "13:24", "13:36", "13:48", "14:00",
    "14:12", "14:24", "14:36", "14:48", "15:00", "15:12", "15:24", "15:36", "15:48", "16:00", "16:12", "16:24", "16:36", "16:48", 
    "17:00", "17:12", "17:24", "17:36", "17:48", "18:00", "18:12", "18:24", "18:36", "18:48", "19:00", "19:12", "19:24","20:02","20:52"];

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
var busRoute = [[42.17016432248593,24.72049290262735,0],
    [42.1702187953539,24.72060203567547,0],
    [42.17043996638925,24.72046553335284,0],
    [42.17024804623917,24.720174159772,0],
    [42.16992639019375,24.72041511225291,0],
    [42.16945072429192,24.71965471211333,0],
    [42.16504505928813,24.72454289074842,0],
    [42.16375551218091,24.72638198112181,0],
    [42.15978536883951,24.72034674898258,0],
    [42.15952009215287,24.720136466173,0],
    [42.15657706108021,24.72081020927684,0],
    [42.15897418594479,24.73781873966467,0],
    [42.15553709620865,24.73861954360489,0],
    [42.15201822076721,24.73871169094437,0],
    [42.15075655637568,24.73973332559453,0],
    [42.14911672729804,24.74057755155926,0],
    [42.15083059734003,24.74474106971766,0],
    [42.1513409861067,24.7465533006026,0],
    [42.15130437553214,24.74786169124553,0],
    [42.15150388666962,24.74978460444446,0],
    [42.15130263345353,24.75014516067066,0],
    [42.15085224948913,24.75015235149639,0],
    [42.1485912171275,24.75060684318174,0],
    [42.14538142118737,24.75136018949762,0],
    [42.13668954230634,24.75223724127577,0],
    [42.13370969300736,24.75583794691666,0],
    [42.1333851188497,24.75615295494832,0],
    [42.13263234354665,24.75565912024517,0],
    [42.13171326689601,24.75502455409808,0],
    [42.13093945684571,24.75490418012149,0],
    [42.13007639249662,24.7551036314295,0],
    [42.12995703588872,24.75492690280918,0],
    [42.13035179425012,24.74414242122185,0],
    [42.12653990010262,24.74212432752492,0],
    [42.12590887097799,24.75241950680012,0],
    [42.12591570017884,24.75476927066229,0],
    [42.11894627655094,24.7559396030876,0],
    [42.11880119674646,24.75627368750629,0],
    [42.1188654241083,24.75863626066917,0],
    [42.10297841758402,24.76060668652965,0],
    [42.10312376754444,24.76102843246361,0],
    [42.10333312681698,24.7610974529684,0],
    [42.10379338802558,24.76070090210681,0],
    [42.11915627988137,24.7588447129114,0],
    [42.11900615642757,24.75641056529621,0],
    [42.1192673270107,24.75614675712688,0],
    [42.12618797119656,24.75498210247878,0],
    [42.12610016510031,24.75245423422724,0],
    [42.12677751053152,24.74266432668692,0],
    [42.13016861675246,24.7444511744929,0],
    [42.12979298899162,24.75460052849503,0],
    [42.13197562184206,24.75488285411135,0],
    [42.13138312574717,24.75590035916617,0],
    [42.13090769090213,24.75591714114391,0],
    [42.13069198427338,24.75578218696512,0],
    [42.130740808701,24.75530088436805,0],
    [42.13124220545166,24.75509146955072,0],
    [42.13314604258296,24.75630713453997,0],
    [42.13357840743538,24.75740019037606,0],
    [42.13344702076167,24.75796932110588,0],
    [42.1328685007316,24.75848664700264,0],
    [42.1325579758327,24.75816181059199,0],
    [42.1326017462185,24.75761381872251,0],
    [42.13678971028919,24.75259408178225,0],
    [42.13677460445872,24.75266077793525,0],
    [42.13712500571946,24.75232900685718,0],
    [42.14653499661491,24.75147834280567,0],
    [42.14931030576349,24.75073794669223,0],
    [42.15102399906692,24.75048553415971,0],
    [42.1503620829108,24.7506173230606,0],
    [42.15196361254289,24.75040838855165,0],
    [42.15168052699199,24.74981250568462,0],
    [42.15143279441624,24.74840739592667,0],
    [42.15141227210363,24.74713130806905,0],
    [42.15149538252574,24.74649429722697,0],
    [42.15084805325228,24.74433313849458,0],
    [42.14941170235747,24.74078218430967,0],
    [42.15101627118226,24.7398201310851,0],
    [42.15235078552033,24.73874857379279,0],
    [42.15505973756478,24.73879446799644,0],
    [42.15651816418333,24.73873046529279,0],
    [42.15920729533884,24.73802813132009,0],
    [42.15674693128499,24.72095799044099,0],
    [42.15948661531598,24.72035894605252,0],
    [42.15986058804272,24.72064586497018,0],
    [42.16107439876485,24.72257523994433,0],
    [42.16382492826712,24.72664696304769,0],
    [42.16943366738257,24.71985419886591,0],
    [42.16988734616204,24.7206372154983,0],
    [42.17014243145844,24.72045238437206,0],
    [42.17018216831558,24.72051573128493,0],
    [42.17023484769548,24.72060749986241,0]];
// Create a polyline for the bus route and add it to the map
L.polyline(busRoute, {color: 'red'}).addTo(map);