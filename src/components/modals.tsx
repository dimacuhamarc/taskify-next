
export default function CreateCategoryModal() {
  return (
    <dialog id="create_category_modal" className="modal backdrop-blur-sm">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Create a new Category!</h3>
        <p className="py-4">Press ESC key or click the button below to close</p>
        <div className="modal-action">
          <button className="btn btn-primary">Create</button>
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  )
}