export default function ReviewComment({ comment, setComment }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-helper">Comentario del evaluador</label>

      <textarea
        rows={6}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="
          border
          rounded-lg
          p-4
          resize-none
        "
        placeholder="Escribe observaciones para el emprendedor..."
      />
    </div>
  );
}
