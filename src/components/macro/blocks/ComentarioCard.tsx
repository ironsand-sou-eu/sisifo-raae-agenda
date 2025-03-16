// import { Comentario } from "../../../global";

// type ComentarioCardProps = {
//   comentario: Comentario;
// };

// function getInitials(name: string) {
//   const names = name.split(" ");
//   const firstLetter = names[0][0].toUpperCase();
//   const lastLetter = names[names.length - 1][0].toUpperCase();
//   return `${firstLetter}${lastLetter}`;
// }

// function getFirstAndLastNames(name: string) {
//   const names = name.split(" ");
//   const firstName = names[0];
//   const lastName = names[names.length - 1];
//   return `${firstName} ${lastName}`;
// }

// export default function ComentarioCard({ comentario }: ComentarioCardProps) {
//   const {
//     comentarioWs,
//     dataInclusao,
//     dataModificado,
//     descricaoComentario,
//     pessoaConsultaAutoCompleteSimplesWs,
//     pessoaConsultaAutoCompleteDtoWs,
//   } = comentario;
//   const initials = getInitials(pessoaConsultaAutoCompleteSimplesWs.nomePessoa);
//   const displayDate = new Date(dataModificado ?? dataInclusao).toLocaleDateString("pt-BR");
//   const commentText = "[^id:6767981], deixe eu testar isso aqui....";

//   return (
//     <article className="comment">
//       <div>{initials}</div>
//       <div>{descricaoComentario}</div>
//       <div>{displayDate}</div>
//     </article>
//   );
// }
