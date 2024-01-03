const clientId = "ecc7a12366d74791bc02378af6adc309"; // Replace with your client id
const params = new URLSearchParams(window.location.search)
const code = params.get("code");

if (!code) {
    redirectToAuthCodeFlow(clientId);
} else {
    const accessToken = await getAccessToken(clientId, code);
    const profile = await fetchProfile(accessToken);
    populateUI(profile);
    const top_artists = await fetchTopTen(accessToken);
    populateArtists(top_artists);


}

export async function redirectToAuthCodeFlow(clientId: string) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://localhost:5173/callback");
    params.append("scope", "user-read-private user-read-email user-top-read");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length: number) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier: string) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}


export async function getAccessToken(clientId: string, code: string): Promise<string> {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://localhost:5173/callback");
    params.append("code_verifier", verifier!);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token } = await result.json();
    return access_token;
}

async function fetchProfile(token: string): Promise<any> {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}


async function fetchTopTen(token: string): Promise<any> {
    const result = await fetch("https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=10", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}


function populateUI(profile: any) {
    document.getElementById("displayName")!.innerText = profile.display_name;
    if (profile.images[0]) {
        const profileImage = new Image(100, 100);
        profileImage.src = profile.images[0].url;
        document.getElementById("avatar")!.appendChild(profileImage);
    }
    document.getElementById("id")!.innerText = profile.id;
    document.getElementById("url")!.innerText = profile.href;
    document.getElementById("url")!.setAttribute("href", profile.href);
    document.getElementById("imgUrl")!.innerText = profile.images[0]?.url ?? '(no profile image)';
}

function populateArtists(top_artists: any) {

    document.getElementById("top0")!.innerText = top_artists.items[0].name;
    document.getElementById("top1")!.innerText = top_artists.items[1].name;
    document.getElementById("top2")!.innerText = top_artists.items[2].name;
    document.getElementById("top3")!.innerText = top_artists.items[3].name;
    document.getElementById("top4")!.innerText = top_artists.items[4].name;
    document.getElementById("top5")!.innerText = top_artists.items[5].name;
    document.getElementById("top6")!.innerText = top_artists.items[6].name;
    document.getElementById("top7")!.innerText = top_artists.items[7].name;
    document.getElementById("top8")!.innerText = top_artists.items[8].name;
    document.getElementById("top9")!.innerText = top_artists.items[9].name;

    const image_artist0 = new Image(200, 200);
    const image_artist1 = new Image(200, 200);
    const image_artist2 = new Image(200, 200);
    const image_artist3 = new Image(200, 200);
    const image_artist4 = new Image(200, 200);
    const image_artist5 = new Image(200, 200);
    const image_artist6 = new Image(200, 200);
    const image_artist7 = new Image(200, 200);
    const image_artist8 = new Image(200, 200);
    const image_artist9 = new Image(200, 200);

    image_artist0.src = top_artists.items[0].images[0].url;
    image_artist1.src = top_artists.items[1].images[0].url;
    image_artist2.src = top_artists.items[2].images[0].url;
    image_artist3.src = top_artists.items[3].images[0].url;
    image_artist4.src = top_artists.items[4].images[0].url;
    image_artist5.src = top_artists.items[5].images[0].url;
    image_artist6.src = top_artists.items[6].images[0].url;
    image_artist7.src = top_artists.items[7].images[0].url;
    image_artist8.src = top_artists.items[8].images[0].url;
    image_artist9.src = top_artists.items[9].images[0].url;


    document.getElementById("img0")!.appendChild(image_artist0);
    document.getElementById("img1")!.appendChild(image_artist1);
    document.getElementById("img2")!.appendChild(image_artist2);
    document.getElementById("img3")!.appendChild(image_artist3);
    document.getElementById("img4")!.appendChild(image_artist4);
    document.getElementById("img5")!.appendChild(image_artist5);
    document.getElementById("img6")!.appendChild(image_artist6);
    document.getElementById("img7")!.appendChild(image_artist7);
    document.getElementById("img8")!.appendChild(image_artist8);
    document.getElementById("img9")!.appendChild(image_artist9);


}



