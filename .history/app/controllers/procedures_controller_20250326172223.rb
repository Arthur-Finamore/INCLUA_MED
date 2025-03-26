# app/controllers/procedures_controller.rb
class ProceduresController < ApplicationController
    def apresentacao
      respond_to do |format|
        format.html  # renderiza app/views/procedures/apresentacao.html.erb
        format.js    # renderiza app/views/procedures/apresentacao.js.erb (para AJAX)
      end
    end
    
    def apresentacao
        # Lógica adicional se necessário
        render partial: 'shared/procedures/apresentacao', layout: false
      end

      
  end