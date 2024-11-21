function setCharacter(src) {
    let image = document.getElementById("character");
    image.src = src;
}

function setAccountData(avatar, nick) {
    let account_data = document.getElementById("account-data");
    account_data.innerHTML = `
        <a href="./users/?user=me">
            <div id="account">
                <img href="${avatar}" id="avatar" alt="Avatar"><p id="Nickname">${nick}</p>
            </div>
        </a>
    `
}