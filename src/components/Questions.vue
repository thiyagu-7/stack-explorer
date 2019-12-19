<template>
    <div>
        <div class="pb-4 info-banner">
            <b-alert show variant="info">
                Questions for
                <b>{{tagsArray}}</b> with minimum
                <b>{{minVotes}}</b> votes from
                <b>
                    <FriendlyDate
                        :date="formattedStartDate.date"
                        :month="formattedStartDate.month"
                        :year="formattedStartDate.year"
                    />
                </b> to
                <b>
                    <FriendlyDate
                        :date="formattedEndDate.date"
                        :month="formattedEndDate.month"
                        :year="formattedEndDate.year"
                    />
                </b>
            </b-alert>
        </div>

        <div v-if="questions.length > 0">
            <PostDetailCard
                v-for="(question, i) in questions"
                :key="'question-' + i"
                :link="question.link"
                :title="format(question.title)"
                :tags="question.tags"
                :creationDate="question.creation_date"
                :lastActiveDate="question.last_activity_date"
                :score="question.score"
                :viewCount="question.view_count"
                :ownerName="format(question.owner.display_name)"
                :profileImage="question.owner.profile_image"
                :ownerProfileLink="question.owner.link"
            />

            <div class="overflow-auto">
                <b-pagination-nav
                    align="center"
                    :link-gen="linkGen"
                    v-on:input="transitionPage"
                    v-model="activePage"
                    no-page-detect
                    :number-of-pages="numPages"
                    use-router
                ></b-pagination-nav>
            </div>
        </div>
        <div v-if="questions.length == 0" class="pb-4 info-banner">
            <b-alert show variant="warning">No questions found for the above criteria</b-alert>
        </div>
    </div>
</template>

<script>
import StackExchangeClient from '@/services/StackExchangeClient';
import PostDetailCard from '@/components/PostDetailCard.vue';
import FriendlyDate from '@/components/FriendlyDate.vue';

let domParser = new DOMParser();

export default {
    components: {
        PostDetailCard,
        FriendlyDate
    },
    props: {
        from: {
            type: Number,
            required: true
        },
        to: {
            type: Number,
            required: true
        },
        minVotes: {
            type: Number,
            required: true
        },
        tags: {
            type: String,
            required: true
        },
        page: {
            type: Number,
            default: 1
        },
        pageSize: {
            type: Number,
            default: 5
        }
    },
    data() {
        return {
            questions: {},
            activePage: this.page,
            numPages: '1'
        };
    },
    mounted() {
        window.console.log('Mounted.. Calling search');
        this.search();
    },

    methods: {
        format(str) {
            let decodedString = domParser.parseFromString(str, 'text/html').body
                .textContent;
            return decodedString.replace(/&#([0-9]{1,3});/gi, function(
                match,
                numStr
            ) {
                var num = parseInt(numStr, 10); // read num as normal number
                return String.fromCharCode(num);
            });
        },
        transitionPage(p) {
            window.console.log('Going to page ' + p);
            this.search();
        },
        linkGen(pageNum) {
            let queryParams = JSON.parse(JSON.stringify(this.$route.query));
            if (queryParams) {
                queryParams['page'] = String(pageNum);
            }
            return {
                path: this.$route.path,
                query: queryParams
            };
        },
        search() {
            StackExchangeClient.search(
                'stackoverflow.com',
                this.from,
                this.to,
                this.tags,
                this.minVotes,
                this.page,
                this.pageSize
            )
                .then(res => {
                    //todo:check status
                    this.questions = res.data.items;
                    this.numPages = String(
                        Math.ceil(res.data.total / this.pageSize)
                    );
                })
                .catch(err => window.console.log(err));
        },
        convertDateToMillisecPrecision(date) {
            let d = new Date(date * 1000);
            return {
                date: d.getDate(),
                month: d.getMonth() + 1,
                year: d.getFullYear()
            };
        }
    },
    computed: {
        formattedStartDate() {
            return this.convertDateToMillisecPrecision(this.from);
        },
        formattedEndDate() {
            return this.convertDateToMillisecPrecision(this.to);
        },
        tagsArray() {
            return this.tags.split(';');
        }
    }
};
</script>

<style scoped>
.info-banner {
    width: 80%;
    margin: 0 auto;
    max-width: 1000px;
}
</style>