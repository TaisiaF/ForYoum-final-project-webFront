export default function flattenReplies(
    replies,
    level = 0
) {

    let result = [];

    replies.forEach(reply => {

        const {
            children,
            ...replyWithoutChildren
        } = reply;

        result.push({
            ...replyWithoutChildren,
            level
        });

        if (
            reply.children &&
            reply.children.length > 0
        ) {

            result = result.concat(
                flattenReplies(
                    children,
                    level + 1
                )
            );
        }
    });

    return result;
}