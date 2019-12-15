<template>
    <div class="pb-4 post-card">
        <b-card>
            <b-row no-gutters>
                <b-col md="2">
                    <a :href="ownerProfileLink">
                    <b-card-img height="120" :src="profileImage" class="rounded-0"></b-card-img>
                    <b>{{ownerName}}</b>
                    </a>
                </b-col>
                <b-col md="1" align="center">
                    <span style="font-size: 30px;">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="80"
                            height="40"
                            viewBox="0 0 10 16"
                        >
                            <path fill-rule="evenodd" d="M12 11L6 5l-6 6h12z" />
                        </svg>
                        <h5 class="pl-1 votes-count">{{score}}</h5>
                        <svg
                            class="mt-n4"
                            xmlns="http://www.w3.org/2000/svg"
                            width="80"
                            height="40"
                            viewBox="0 0 10 16"
                        >
                            <path fill-rule="evenodd" d="M0 5l6 6 6-6H0z" />
                        </svg>
                    </span>
                </b-col>
                <b-col md="8">
                    <b-card-body align="center">
                        <b-link class="question-title" :href="link" target="_blank">
                            <h4>{{ title }}</h4>
                        </b-link>
                        <b-card-text>
                            <b-row>
                                <b-col class="tags">
                                    <span v-for="(tag, i) in tags" :key="'tag-list-' + i">
                                        <b-badge variant="info">{{tag}}</b-badge>
                                        {{i &lt; tags.length - 1 ? ' ' : ''}}
                                    </span>
                                </b-col>
                            </b-row>
                        </b-card-text>
                    </b-card-body>
                </b-col>
            </b-row>
            <template v-slot:footer>
                <b-row class="text-muted">
                    <b-col>
                        Asked:
                        <FriendlyDate
                            :date="formattedCreatedDate.date"
                            :month="formattedCreatedDate.month"
                            :year="formattedCreatedDate.year"
                        />
                    </b-col>
                    <b-col>
                        Active:
                        <FriendlyDate
                            :date="formattedLastActiveDate.date"
                            :month="formattedLastActiveDate.month"
                            :year="formattedLastActiveDate.year"
                        />
                    </b-col>
                    <b-col>Views: {{viewCount}}</b-col>
                </b-row>
            </template>
        </b-card>
    </div>
</template>

<script>
import FriendlyDate from '@/components/FriendlyDate.vue';

export default {
    components: {
        FriendlyDate
    },
    props: {
        link: String,
        title: String,
        tags: Array,
        creationDate: Number,
        lastActiveDate: Number,
        score: Number,
        viewCount: Number,
        ownerName: String,
        profileImage: String,
        ownerProfileLink: String
    },
    computed: {
        formattedCreatedDate() {
            return this.convertDateToMillisecPrecision(this.creationDate);
        },
        formattedLastActiveDate() {
            return this.convertDateToMillisecPrecision(this.lastActiveDate);
        }
    },
    methods: {
        convertDateToMillisecPrecision(date) {
            let d = new Date(date * 1000);
            return {
                date: d.getDate(),
                month: d.getMonth() + 1,
                year: d.getFullYear()
            };
        }
    }
};
</script>

<style scoped>
.question-title {
    text-decoration: none;
    color: #242729;
}
.votes-count {
    color: green;
}
.post-card {
    width: 80%; 
    margin: 0 auto;
    max-width: 1000px;
}
</style>
