<template>
    <span>{{ friendlyDate }}</span>
</template>

<script>
export default {
    props: {
        year: {
            type: Number
        },
        month: {
            type: Number
        },
        date: {
            type: Number
        }
    },
    methods: {
        nth(d) {
            if (d > 3 && d < 21) return 'th';
            switch (d % 10) {
                case 1:
                    return 'st';
                case 2:
                    return 'nd';
                case 3:
                    return 'rd';
                default:
                    return 'th';
            }
        }
    },
    computed: {
        friendlyDate() {
            var monthString = new Date(
                this.year,
                this.month - 1,
                this.date
            ).toLocaleDateString('default', { month: 'long' });
            return (
                this.date +
                this.nth(this.date) +
                ' ' +
                monthString +
                ' ' +
                this.year
            );
        }
    }
};
</script>