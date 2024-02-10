import EditTopicForm from "@/components/EditTopicForm";

// const getTopicById = async (id) => {
//     try {
//         const res = await fetch(`http://localhost:3000/api/topics/${id}`, {
//             cache: "no-store",
//         });

//         if (!res.ok) {
//             throw new Error("Failed to fetch topic");
//         }

//         return res.json();
//     } catch (error) {
//         console.log(error);
//     }
// };

export default async function EditTopic({ params }) {
    // const { id } = params;
    // const { topic } = await getTopicById(id);
    // const { title, description } = topic;


    const id = 123
    const title = 'Test Title 1'
    const description = 'Test description 1'

    return (
        <>
            <EditTopicForm id={id} title={title} description={description} />
        </>
    );
}