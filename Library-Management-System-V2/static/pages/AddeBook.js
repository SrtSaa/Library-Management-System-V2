import adminNavbar from "../components/adminNavbar.js";



const AddeBook = {
    template:`
    <div>
        <adminNavbar title="Add eBook"/>
        <div style="margin-top: 50px; margin-bottom: 10px;">
            <h1 class="h1 text-center">Add eBook</h1></br>
        </div>

        <div class="register-style">
            <div class='text-danger text-center h4' v-if="sections.length == 0"><strong>Add a Section First...</strong></div>
            <div v-if="sections.length != 0">
                <div class="mb-3">
                    <label class="h5 form-label me-4">Title</label><div id="title" style='display: inline'><b><span class="formerror text-danger"></span></b></div>
                    <input type="text" id="ftitle" class="form-control" placeholder="Title of the eBook" v-model="ebook_details.title">
                </div>
                
                <div class="my-3">
                    <label class="h5 form-label me-4">Section</label><div id="section" style='display: inline'><b><span class="formerror text-danger"></span></b></div>
                    <select class="form-select" v-model="ebook_details.SectionID">
                        <option value="-1" selected>Choose Section</option>
                        <option :value="section.id" v-for="section in sections">{{section.title}}</option>
                    </select>
                </div>

                <div class="mb-3">
                    <label class="h5 form-label me-4">Authors</label><div id="authors" style='display: inline'><b><span class="formerror text-danger"></span></b></div>
                    <input type="text" id="fauthors" class="form-control" placeholder="Authors" v-model="ebook_details.authors">
                </div>

                <div class="my-3">
                    <label class="h5 form-label">Description</label>
                    <textarea class="form-control" rows="3" v-model="ebook_details.description"></textarea>
                </div>
                
                <div class='text-danger text-center my-4'><b>{{msg}}</b></div>
                <button class="d-grid col-5 mx-auto btn btn-primary mt-4" @click='addebook'>Add eBook</button>
            </div>
        </div>
    </div>
    `,

    components: {
        adminNavbar
    },

    data() {
        return {
            sections: [],
            ebook_details: {
                title: null,
                SectionID: -1,
                authors: null,
                description: null
            },
            msg: null
        }
    },

    async mounted() {
        const res = await fetch('/api/Section', {
            headers: {
                'Authentication-Token': localStorage.getItem('auth-token'),
            },
        })
        if (res.ok) {
            this.sections = await res.json();
        }
    },

    methods: {
        async addebook(){
            if (this.selectedID == -1){
                seterror("section", "*Please Select a Section!");
            } else {
                if (validateeBookDetails()){
                    if (this.ebook_details['description'])
                        this.ebook_details['description'] = this.ebook_details['description'].trim();

                    const res = await fetch(window.location.origin + '/api/eBook', {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json', 
                            'Authentication-Token': localStorage.getItem('auth-token')
                        },
                        body: JSON.stringify(this.ebook_details),
                    });
                    const data = await res.json();
                    if (res.ok) {
                        this.ebook_details['title'] = null;
                        this.ebook_details['description'] = null;
                        this.ebook_details['SectionID'] = -1;
                        this.ebook_details['authors'] = null;
                    }
                    this.msg = "*" + data.message;
                }
            }
        }
    }
};



export default AddeBook;