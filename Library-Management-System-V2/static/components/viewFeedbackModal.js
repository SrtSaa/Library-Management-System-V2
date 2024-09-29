const viewFeedbackModal = {
    template: `
    <div>
        <div class="modal d-block" id="feedbackwindow" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header" style="background-color: #50c76c;">
                        <h1 class="modal-title fs-5">Feedbacks</h1>
                    </div>
                    <div class="modal-body" style="background-color: #f7e9f7;">
                        <div style="max-height: 58vh; overflow-y: auto;">
                            <table class="table table-striped table-light table-hover align-middle">
                                <tbody class="table-group-divider">
                                    <tr class="text-center" v-for="(feedback, index) in feedbacks">
                                        <th scope="row">{{ index+1 }}</th>
                                        <td>{{ feedback }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class='text-danger text-center my-4'><b>{{msg}}</b></div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" type="button" @click='closeModal'>Go Back</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,

    props: {
        bookID: {
            type: Number,
            required: true
        }
    },

    data() {
        return {
            feedbacks: [],
            msg: null
        }
    },

    methods: {
        closeModal() {
            this.$emit('close1');
        }
    },

    async mounted() {
        const res = await fetch(window.location.origin + '/getFeedback', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Authentication-Token': localStorage.getItem('auth-token')
            },
            body: JSON.stringify({
                'book_id': this.bookID
            })
        }); 
        const data = await res.json();
        if (res.ok) {
            this.feedbacks = data;
        } else {
            this.msg = "*" + data.message;
        }
    }
};



export default viewFeedbackModal;