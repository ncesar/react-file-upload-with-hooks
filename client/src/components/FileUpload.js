/* eslint-disable no-lone-blocks */
import React, { Fragment, useState } from 'react' 
import axios from 'axios';
import Message from './Message';
import Progress from './Progress';

const FileUpload = () => {
    const [file, setFile] = useState('');
    const [fileName, setFileName] = useState('Choose file');
    const [uploadedFile, setUploadedFile] = useState({});
    const [message, setMessage] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState(0);

    const onChangeHandler = e => {
        setFile(e.target.files[0]); {/* o type file da 1 array como padrao, mas para pegar so o primeiro setamos como [0] */}
        setFileName(e.target.files[0].name); {/* aí ta pegando o nome do target.files na posição 0(que seria a primeira posiçao) */}
    }

    const onSubmitHandler = async e => { {/* define uma função assícrona, que retornará uma Promise(valor que pode estar disponível agora, no futuro
    ou nunca..) */}
        e.preventDefault();
        const formData = new FormData(); {/* da a opção de compilar um valor de chaves para enviar usando o XMLHttpRequest. É usado geralmente para
        enviar dados de um form */}
        formData.append('file', file);
        try {
            {/* o await pausa a async e espera pela resolução da Promise, e depois retorna a execução
            da função async */}
            {/* content-type diz para o client qual é o tipo do conteúdo que a resposta(res) vai ter. */}
            const res = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' 
                },
                onUploadProgress: progressEvent => {
                  setUploadPercentage(parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total)))
                
                //tirar a porcentagem
                setTimeout(() => setUploadPercentage(0), 10000);
                }

             }); {/* como ja configuramos o proxy, nao precisamos especificar o domínio(localhost/3000) no axios.post */}
             const { fileName, filePath } = res.data;
             setUploadedFile({ fileName, filePath });
             setMessage('File uploaded');
        } catch(err) {
            if(err.response.status === 500) {
                setMessage('There was a problem with the server');
            }else{
                setMessage(err.response.data.msg);
            }
        }
    }

  return (
    <Fragment>
      {/* retorna multiplos elementos, agrumaneot uma lista de filhos sem nodes extras
    isso é a mesma coisa que utilizar <> no inico e no final. Basicamente sem precisar wrapar tudo dentro de uma div */}
    {message ? <Message msg={message} /> : null}
      <form onSubmit={onSubmitHandler}>
        <div className="custom-file mb-4">
          <input type="file" className="custom-file-input" id="customFile" onChange={onChangeHandler} />
          <label className="custom-file-label" htmlFor="customFile">
            {fileName} {/* n precisa do this por ser stateless */}
          </label>
        </div>
        <Progress percentage={uploadPercentage} />

        <input
          type="submit"
          value="Upload"
          className="btn btn-primary btn-block mt-4"
        />
      </form>
      { uploadedFile ? <div className="row mt-5">
            <div className="col-md-6">
                <h3 className="text-center">{ uploadedFile.fileName }</h3>
                <img style={{width: '100%'}} src={uploadedFile.filePath} alt="" />
            </div>
      </div> : null}
    </Fragment>
  );
}

export default FileUpload;
