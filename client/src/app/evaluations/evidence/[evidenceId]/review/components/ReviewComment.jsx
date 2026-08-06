export default function ReviewComment({ comment, setComment }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-helper">Comentario del evaluador</label>

      <textarea
        rows={6}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="
glass-effect-secondary
border-theme
rounded-xl
p-4
resize-none
text-primary-theme
placeholder:text-secondary-theme
outline-none
focus:border-cyan-400
"
        placeholder="Escribe observaciones para el emprendedor..."
      />
    </div>
  );
}
