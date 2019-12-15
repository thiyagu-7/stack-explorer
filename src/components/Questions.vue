<template>
    <div>
        <div ng-if="questions.length > 0">
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
        </div>
        <div class="overflow-auto">
            <b-pagination-nav align="center"
                :link-gen="linkGen"
                v-on:input="transitionPage"
                v-model="activePage"
                no-page-detect
                :number-of-pages="numPages"
                use-router
            ></b-pagination-nav>
        </div>
    </div>
</template>

<script>
import StackExchangeClient from '@/services/StackExchangeClient';
import PostDetailCard from '@/components/PostDetailCard.vue';

let domParser = new DOMParser();

export default {
    components: {
        PostDetailCard
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
        }
    }
};
</script>