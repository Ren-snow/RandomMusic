const CLIENT_ID = "Client ID";
const CLIENT_SECRET = "Client Secret";

async function getAccessToken() {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + btoa(CLIENT_ID + ":" + CLIENT_SECRET),
        },
        body: "grant_type=client_credentials",
    });

    const data = await response.json();
    return data.access_token;
}

const album =  document.querySelector('#js-album')
const artist = document.querySelector('#js-artist')
const imgWrapper = document.querySelector('#js-image-wrapper');


const fromYear = 1950;
const toYear = 1960;


async function getAlbum() {
  // let allAlbums = [];
  let offset = 0;
  // const limit = 50;
  const token = await getAccessToken();
  // for(let i=0; i<=100; i += 50) {
  //   // offsetをiにすればいいのでは？
  // }
  const response = await fetch(
      `https://api.spotify.com/v1/search?q=year:${fromYear}-${toYear}&type=album&limit=50&offset=${offset}`,
      {
          headers: { Authorization: `Bearer ${token}` },
      }
  );
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = await response.json();
  console.log(data);

  const filteredData = data.albums.items.filter((info) => {
      return info.album_type === "album";
  });
  const count = filteredData.length;
  const rand = Math.floor( Math.random() * count);
  const albumName = filteredData[rand].name;
  album.innerText = albumName;
  const albumArtist= filteredData[rand].artists[0].name;
  artist.innerText = albumArtist
  if (filteredData[rand].images[1].url) {
    const img = document.createElement('IMG')
    img.classList.add("aspect-square", "w-full");
    img.src = filteredData[rand].images[1].url;
    imgWrapper.append(img);
  }
}

// getAlbum(0);
// getAlbum(50);
// getAlbum(100);

// async function getAlbum(offset) {
//     const token = await getAccessToken();
//     const response = await fetch(
//         // `https://api.spotify.com/v1/search?q=${encodeURIComponent(trackName)}&type=album&limit=50&year:1990-1999`,
//         `https://api.spotify.com/v1/search?q=year:${fromYear}-${toYear}&type=album&limit=50&offset=${offset}`,
//         {
//             headers: { Authorization: `Bearer ${token}` },
//         }
//     );

//     const data = await response.json();
//     console.log(data);
//     const filteredData = data.albums.items.filter((info) => {
//         return info.album_type === "album";
//     });
//     const count = filteredData.length;
//     console.log(count);
//     const rand = Math.floor( Math.random() * count);
//     console.log(rand);
//     const albumName = filteredData[rand].name;
//     console.log(albumName);
// }


