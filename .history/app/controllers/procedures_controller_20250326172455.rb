# app/controllers/procedures_controller.rb
class ProceduresController < ApplicationController
    def apresentacao
      # Lógica adicional se necessário
      render partial: 'shared/procedures/apresentacao', layout: false
    end
  end