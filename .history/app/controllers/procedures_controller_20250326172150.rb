# app/controllers/procedures_controller.rb
class ProceduresController < ApplicationController
    def apresentacao
      respond_to do |format|
        format.html  # renderiza app/views/procedures/apresentacao.html.erb
        format.js    # renderiza app/views/procedures/apresentacao.js.erb (para AJAX)
      end
    end
    
    # Adicione métodos adicionais para outros procedimentos se necessário
    # def pre_exame; end
    # def acuidade; end
  end