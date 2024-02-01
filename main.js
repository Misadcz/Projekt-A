const token = 'BQDYYqji5PZMwAQcOf9by0vc6KrW0da5jPLTxtfaTxmbkSjaxS0LeIraBvaxNbkMxjYMythNAF8lH861B5nOnVjC-Xyy74IoeCuPqJtYrhs9dacK1lFN9leAQ9OVXAYCtBNllIXQ5jBIzuSkcrbqR3Hiuv75KWb2ErX4aQniQ3Uy3zICqxO2GTFAaMaV7fMpk2wwSAuWphcHYhTmZnPsMdv5tXmX2rb27h2gQJez8VScIZYHNT9XCnO0njN8nDDpyNWC_A';

async function fetchWebApi(endpoint, method, body) {
  const res = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method,
    body: JSON.stringify(body),
  });
  return await res.json();
}

//https://developer.spotify.com/documentation/web-api/reference/


async function getArtist(finder) {

  return await fetchWebApi(`search?q=${finder}&type=artist`, 'GET');
}


async function getTracks(finder) {

  return await fetchWebApi(`artists/${finder}/top-tracks?market=ES`, 'GET');
}

async function getTrack(finder) {

  return await fetchWebApi(`tracks/${finder}`, 'GET');
}

var popularityList = [];
var nameList = [];
var defaultList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function findIt() {
  var finder = document.getElementById("iButton").value;


  getArtist(finder)
    .then(art => {
      console.log(art.artists.items[0]);
      var body = document.getElementById('back');
      var backgroundImageUrl = art.artists.items[0].images[0].url;
      body.style.backgroundImage = `url(${backgroundImageUrl})`;

      var name = document.getElementById('name');
      var followers = document.getElementById('followers');
      var genres = document.getElementById('genres');

      name.innerText = 'Name : ' + art.artists.items[0].name;
      followers.innerText = art.artists.items[0].followers.total + ' Followers';
      genres.innerText = 'Genres : ' + art.artists.items[0].genres;



      getTracks(art.artists.items[0].id)
        .then(info => {

          for (var i = 0; i < info.tracks.length; i++) {
            popularityList[i] = info.tracks[i].popularity;
            nameList[i] = info.tracks[i].name;

            console.log(info.tracks[i].name);
            console.log(info.tracks[i].popularity);

          }

          var min = popularityList[0];
          var max = popularityList[0];
          for (var i = 1; i < 10; i++) {
            if (min > popularityList[i])
              min = popularityList[i];
            if (max < popularityList[i])
              max = popularityList[i];
          }
          max += 3;
          min -= 3;


          new Chart("chart", {
            type: "line",
            data: {
              labels: nameList,
              datasets: [{
                fill: false,
                lineTension: 0,
                backgroundColor: "red",
                borderColor: "rgba(255,0,0,0.4)",
                data: popularityList
              }]
            },
            options: {
              legend: { display: false },
              scales: {
                xAxes: [{ 
                  ticks: { min: 0, max: 10 }, 
                  scaleLabel: {
                    display: true,
                    labelString: 'Název písničky'
                  }
                }],
                yAxes: [{ 
                  ticks: { min: min, max: max },
                  scaleLabel: {
                    fontColor: 'black',
                    fontWeight: 'bold',
                    display: true,
                    labelString: 'Popularita',
                    
                  }
                }]
              },
            }
          });



        }).catch(error => {
          console.error("Error fetching artist information:", error);
        });


    })
    .catch(error => {
      console.error("Error fetching artist information:", error);
    });

}





