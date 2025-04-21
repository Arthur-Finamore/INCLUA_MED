class ProceduresController < ApplicationController
  def apresentacao
    render partial: 'procedures/apresentacao'
  end

  def pre_exame
    render partial: 'procedures/pre_exame'
  end

  def acuidade
    render partial: 'procedures/acuidade'
  end

  def biomicroscopia
    render partial: 'procedures/biomicroscopia'
  end

  def refracao
    render partial: 'procedures/refracao'
  end

  def tonometria
    render partial: 'procedures/tonometria'
  end
end
