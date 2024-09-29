const rateModal = {
    template: `
    <div>
        <div class="modal d-block" id="ratewindow" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header" style="background-color: #50c76c;">
                        <h1 class="modal-title fs-5">Rate & Feedback</h1>
                    </div>
                    <div class="modal-body" style="background-color: #f7e9f7;">
                        <div class="row mb-3 g-4 align-items-center">
                            <div class="col-auto">
                                <label class="col-form-label"><strong>Rate</strong></label>
                            </div>
                            <div class="col-auto">
                                <input type="number" id="rating" min="1" max="5" class="form-control" required v-model="currRate">
                            </div>
                            <div class="col-auto">
                                <span class="form-text">Must be between 1-5.</span>
                            </div>
                            <div id="wrongrate" style='display: inline'><b><span class="formerror text-danger"></span></b></div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label"><strong>Feedback</strong></label>
                            <textarea class="form-control" id="feedback" rows="3" v-model="currFeedBack"></textarea>
                        </div>
                        
                        <div class='text-danger text-center my-4'><b>{{msg}}</b></div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" type="button" @click='closeModal'>Go Back</button>
                        <button class="btn btn-success" type="button" @click='submitRate'>Submit</button>
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
            currRate: null,
            currFeedBack: '',
            msg: null
        }
    },

    methods: {
        closeModal() {
            this.$emit('close1');
        },

        async submitRate() {
            clearErrors();
            const rate = Number(this.currRate);
            if (rate < 1 || rate > 5) {
                seterror('wrongrate', '*Enter Valid Rate!');
            } else {
                const res = await fetch(window.location.origin + '/rate-book', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json', 
                        'Authentication-Token': localStorage.getItem('auth-token')
                    },
                    body: JSON.stringify({
                        'type': 'put_rate',
                        'username': localStorage.getItem('username'),
                        'book_id': this.bookID,
                        'rate': rate,
                        'feedback': this.currFeedBack
                    })
                });
                const data = await res.json();
                this.msg = "*" + data.message;
                if (res.ok) {
                    this.$emit('close2');
                }
            }
        }
    },

    async mounted() {
        const res = await fetch(window.location.origin + '/rate-book', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Authentication-Token': localStorage.getItem('auth-token')
            },
            body: JSON.stringify({
                'type': 'get_rate',
                'username': localStorage.getItem('username'),
                'book_id': this.bookID
            })
        });
        const data = await res.json();
        if (res.ok) {
            this.currRate = data['rate'];
            this.currFeedBack = data['feedback'];
        } else {
            this.msg = "*" + data.message;
        }
    }
}

export default rateModal;
