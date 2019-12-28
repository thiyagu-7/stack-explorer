<template>
    <div class="container">
        <b-container>
            <b-row>
                <b-col>
                    <h5>Start date</h5>
                    <datetime
                        v-model="fromDate"
                        type="date"
                        value-zone="local"
                        :max-datetime="toDate"
                    ></datetime>
                </b-col>
                <b-col sm="2.5">
                    <h5>Minimum number of votes</h5>
                    <b-form-input size="sm" type="number" v-model="minVotes" :state="!!minVotes"></b-form-input>
                </b-col>
                <b-col>
                    <h5>End date</h5>
                    <datetime
                        v-model="toDate"
                        type="date"
                        value-zone="local"
                        :max-datetime="toDate"
                    ></datetime>
                </b-col>
            </b-row>

            <b-row class="mt-4">
                <b-col cols="12">
                    <h5>Tags</h5>
                </b-col>
            </b-row>

            <b-row
                class="mt-4"
                v-for="(tagInput, index) in selectedTagsInput"
                :key="'tag-' + index"
            >
                <b-col md="2" offset-md="2">
                    <h6>Tag - {{index + 1}}</h6>
                </b-col>

                <b-col cols="4">
                    <b-form-input list="tagsDropdown" v-model="tagInput.tag"></b-form-input>
                    <b-form-datalist id="tagsDropdown" :options="allTags"></b-form-datalist>

                    <b-form-invalid-feedback id="tagsDropdown">Please select a tag</b-form-invalid-feedback>
                </b-col>

                <b-col cols="2">
                    <button
                        type="button"
                        class="btn btn-outline-success btn-circle btn-lg"
                        @click="addTagAtIndex(index)"
                    >
                        <i class="fa fa-plus"></i>
                    </button>
                    &nbsp; &nbsp;
                    <button
                        type="button"
                        class="btn btn-outline-danger btn-circle btn-lg"
                        v-if="index != 0"
                        @click="removeTagAtIndex(index)"
                    >
                        <i class="fa fa-remove fa-lg"></i>
                    </button>
                </b-col>
            </b-row>

            <div>
                <b-button class="mt-4" variant="success" @click="check">Go</b-button>
            </div>
        </b-container>
    </div>
</template>

<script>
import AllTags from '@/data/tags.json';

export default {
    data() {
        return {
            toDate: new Date().toISOString().slice(0, 10),
            fromDate: (() => {
                var date = new Date();
                date.setDate(date.getDate() - 2);
                return date.toISOString().slice(0, 10);
            })(),
            minVotes: 5,
            allTags: AllTags.allTags,
            selectedTagsInput: [{ tag: '' }]
        };
    },
    methods: {
        check() {
            if (this.validateInputs()) {
                this.$router.push({
                    path: 'questions',
                    query: {
                        from: this.parseDateToTimestamp(this.fromDate),
                        to: this.parseDateToTimestamp(this.toDate),
                        minvotes: this.minVotes,
                        tags: this.selectedTagsInput
                            .map(obj => obj.tag)
                            .join(';')
                    }
                });
            }
        },
        addTagAtIndex(index) {
            this.selectedTagsInput.splice(index + 1, 0, { tag: '' });
        },
        removeTagAtIndex(index) {
            this.selectedTagsInput.splice(index, 1);
        },
        validateInputs() {
            if (!this.minVotes) {
                alert('Please enter the minimum number of votes');
                return false;
            }
            if (this.selectedTagsInput.some(obj => !obj.tag)) {
                alert('One or more tags values are empty');
                return false;
            }
            return true;
        },
        parseDateToTimestamp(d) {
            return new Date(d).getTime() / 1000;
        }
    }
};
</script>

<style scoped>
.btn-circle {
    width: 30px;
    height: 30px;
    padding: 6px 0px;
    border-radius: 15px;
    text-align: center;
    font-size: 12px;
    line-height: 1.42857;
}
</style>
