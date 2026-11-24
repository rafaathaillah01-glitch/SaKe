async function tampilkanAkun() {
    const { data, error } = await supabaseClient.auth.getUser();

    if (error || !data.user) {
        window.location.href = "loreg.html";
        return;
    }

    document.getElementById("userEmail").textContent =
        data.user.email;
}

async function logout() {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        alert(error.message);
        return;
    }

    window.location.href = "loreg.html";
}

tampilkanAkun();