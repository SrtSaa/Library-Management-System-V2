const userNavbar = {
    template: `
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
            <div class="h2">{{title}}</div>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
                <ul class="navbar-nav">
                    <li class="nav-item h5 ms-4">
                        <router-link class="nav-link" to="/user_dashboard">My Books</router-link>
                    </li>
                    <li class="nav-item h5 ms-4">
                        <router-link class="nav-link" to="/vieweBooks">View eBooks</router-link>
                    </li>
                    <li class="nav-item h5 ms-4">
                        <router-link class="nav-link" to="/viewReturnedBooks">Returned eBooks</router-link>
                    </li>
                    <li class="nav-item h5 ms-4">
                        <router-link class="nav-link" to="/viewChart">Stat</router-link>
                    </li>
                    <li class="nav-item h5 ms-4">
                        <router-link class="nav-link" to="/userProfile">Profile</router-link>
                    </li>
                    <li class="nav-item h5 ms-4">
                        <a class="nav-link" href="#" @click='logout'>Logout</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    `,

    props: {
        title: {
            type: String,
            required: true
        }
    },

    methods: {
        logout(){
            localStorage.clear();
            this.$router.push({ path: '/' });
        }
    }

};



export default userNavbar;