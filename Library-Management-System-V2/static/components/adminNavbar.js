const adminNavbar = {
    template: `
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
            <div class="h2">{{title}}</div>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
                <ul class="navbar-nav">
                    <li class="nav-item h5">
                        <router-link class="nav-link" to="/admin_dashboard">Home</router-link>
                    </li>
                    <li class="nav-item dropdown h5">
                        <div class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Manage eBook
                        </div>
                        <ul class="dropdown-menu">
                            <li><router-link to="/addeBook" class="dropdown-item">Create eBook</router-link></li>
                            <li><router-link to="/vieweBooks" class="dropdown-item">View eBooks</router-link></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown h5">
                        <div class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Manage Sections
                        </div>
                        <ul class="dropdown-menu">
                            <li><router-link to="/addSection" class="dropdown-item">Add Section</router-link></li>
                            <li><router-link to="/deleteSection" class="dropdown-item">Delete Section</router-link></li>
                        </ul>
                    </li>
                    <li class="nav-item h5">
                        <router-link class="nav-link" to="/viewRequest">View Request</router-link>
                    </li>
                    <li class="nav-item h5">
                        <router-link class="nav-link" to="/viewUsers">View Users</router-link>
                    </li>
                    <li class="nav-item dropdown h5">
                        <div class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Others
                        </div>
                        <ul class="dropdown-menu">
                            <li><router-link class="dropdown-item" to="/viewIssuedBooks">eBook Issued</router-link></li>
                            <li><router-link class="dropdown-item" to="/viewReturnedBooks">ebook Returned</router-link></li>
                            <li><router-link class="dropdown-item" to="/viewRevokedBooks">Revoke List</router-link></li>
                            <li><router-link class="dropdown-item" to="/viewPurchasedBooks">Purchased Books</router-link></li>
                            <li><router-link class="dropdown-item" to="/viewChart">View Stat</router-link></li>
                            <li><div class="dropdown-item" @click="downlodResource">Download Report</div></li>
                        </ul>
                    </li>
                    <li class="nav-item h5">
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
        },

        async downlodResource() {
            const res = await fetch(window.location.origin + '/download-csv', {
                headers: {
                    'Authentication-Token': localStorage.getItem('auth-token'),
                },
            });
            const data = await res.json();
            
            if (res.ok) {
                const task_id = data['task-id'];
                
                const intv = setInterval(async () => {
                    const csv_res = await fetch(`/get-csv/${task_id}`, {
                        headers: {
                            'Authentication-Token': localStorage.getItem('auth-token'),
                        },
                    });
                    if (csv_res.ok) {
                        clearInterval(intv);
                        window.location.href = `/get-csv/${task_id}`;
                        alert("Your File Downloaded Successfully!!!");
                    }
                }, 1000)
            }
        }
    }

};



export default adminNavbar;