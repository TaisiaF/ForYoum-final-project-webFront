
export default function flattenReplies(
    replies,
    level = 0,
    parentReplyId = null,
    ancestorLastChild = []
) {
    let result = [];

    replies.forEach((reply, index) => {
        const {
            children = [],
            ...replyWithoutChildren
        } = reply;

        const isLastChild =
            index === replies.length - 1;

        result.push({
            ...replyWithoutChildren,
            level,
            parentReplyId:
                reply.parentId || parentReplyId,
            isLastChild,
            ancestorLastChild
        });

        if (children.length > 0) {
            result = result.concat(
                flattenReplies(
                    children,
                    level + 1,
                    reply._id,
                    [...ancestorLastChild, isLastChild]
                )
            );
        }
    });

    return result;
}
