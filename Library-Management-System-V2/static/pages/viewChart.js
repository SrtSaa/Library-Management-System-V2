import adminNavbar from "../components/adminNavbar.js";
import userNavbar from "../components/userNavbar.js";


const viewChart = {
    template: `
    <div>
        <adminNavbar title="View Stat" v-if="role == 'admin'"/>
        <userNavbar title="View Stat" v-else/>
        <div class="d-flex justify-content-evenly flex-wrap" style="margin-top: 70px">
        </div>
    </div>
    `,


    components: {
        adminNavbar,
        userNavbar
    },

    data() {
        return {
            stat: null,
            test: null,
            role: localStorage.getItem('role')
        }
    },

    async mounted() {
        
        if (this.role == 'admin') {
            var res = await fetch(window.location.origin + '/api/chartAPI', {
                method: 'GET',
                headers: { 'Authentication-Token': localStorage.getItem('auth-token')}
            }); 
        }

        if (this.role == 'user') {
            var res = await fetch(window.location.origin + `/api/chartAPI/${localStorage.getItem('username')}`, {
                method: 'GET',
                headers: { 'Authentication-Token': localStorage.getItem('auth-token')}
            }); 
        }

        if (res.ok) {
            this.stat = await res.json();

            if (this.stat && this.stat.length > 0 && Object.keys(this.stat[0]).length > 0) {
                const parentDiv = document.querySelector('.d-flex');
                const newDiv = document.createElement('div');
                newDiv.innerHTML = `
                    <h2 class="h2 text-center mb-5">Demanded Section</h2>
                    <canvas id="section" style="max-height: 300px; max-width: 300px;"></canvas>
                `;
                parentDiv.appendChild(newDiv);
                const ctx1 = document.getElementById('section');
                new Chart(ctx1, {
                    type: 'doughnut',
                    data: {
                        labels: Object.keys(this.stat[0]),
                        datasets: [{
                            label: 'Count',
                            data: Object.values(this.stat[0]),
                            hoverOffset: 4
                        }]
                    },
                    options: {
                        plugins: {
                            legend: {
                                display: false
                            }
                        }
                    }
                });
            }

            if (this.stat && this.stat.length > 1 && Object.keys(this.stat[1]).length > 0) {
                const parentDiv = document.querySelector('.d-flex');
                const newDiv = document.createElement('div');
                newDiv.innerHTML = `
                    <h2 class="h2 text-center mb-5">Top 5 eBooks</h2>
                    <canvas id="ebook" style="max-height: 300px; max-width: 300px;"></canvas>
                `;
                parentDiv.appendChild(newDiv);
                const ctx2 = document.getElementById('ebook');
                new Chart(ctx2, {
                    type: 'pie',
                    data: {
                        labels: Object.keys(this.stat[1]),
                        datasets: [{
                            label: 'Count',
                            data: Object.values(this.stat[1]),
                            hoverOffset: 4
                        }]
                    },
                    options: {
                        plugins: {
                            legend: {
                                display: false
                            }
                        }
                    }
                });
            }

            if (this.role == 'admin' && this.stat && this.stat.length > 2 && Object.keys(this.stat[2]).length > 0) {
                const parentDiv = document.querySelector('.d-flex');
                const newDiv = document.createElement('div');
                newDiv.innerHTML = `
                    <h2 class="h2 text-center mb-5">Top 5 Purchased eBooks</h2>
                    <canvas id="purchase" style="max-height: 300px; max-width: 300px;"></canvas>
                `;
                parentDiv.appendChild(newDiv);
                const ctx3 = document.getElementById('purchase');
                new Chart(ctx3, {
                    type: 'pie',
                    data: {
                        labels: Object.keys(this.stat[2]),
                        datasets: [{
                            label: 'Count',
                            data: Object.values(this.stat[2]),
                            hoverOffset: 4
                        }]
                    },
                    options: {
                        plugins: {
                            legend: {
                                display: false
                            }
                        }
                    }
                });
            }
        }
    }
};






export default viewChart;