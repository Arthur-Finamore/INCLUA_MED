# frozen_string_literal: true

# Licensed to the Software Freedom Conservancy (SFC) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The SFC licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.

# This file is automatically generated. Any changes will be lost!

require_relative 'log/base_log_entry'
require_relative 'log/generic_log_entry'
require_relative 'log/console_log_entry'
require_relative 'log/javascript_log_entry'
require_relative 'log/filter_by'

module Selenium
  module WebDriver
    class BiDi
      class LogInspector
        EVENTS = {
          entry_added: 'entryAdded'
        }.freeze

        LOG_LEVEL = {
          DEBUG: 'debug',
          ERROR: 'error',
          INFO: 'info',
          WARNING: 'warning'
        }.freeze

        def initialize(driver, browsing_context_ids = nil)
          WebDriver.logger.deprecate('LogInspector class',
                                     'Script class with driver.script',
                                     id: :log_inspector)

          unless driver.capabilities.web_socket_url
            raise Error::WebDriverError,
                  'WebDriver instance must support BiDi protocol'
          end

          @bidi = driver.bidi
          @bidi.session.subscribe('log.entryAdded', browsing_context_ids)
        end

        def on_console_entry(filter_by = nil, &block)
          check_valid_filter(filter_by)

          on_log do |params|
            type = params['type']
            console_log_events(params, filter_by, &block) if type.eql?('console')
          end
        end

        def on_javascript_log(filter_by = nil, &block)
          check_valid_filter(filter_by)

          on_log do |params|
            type = params['type']
            javascript_log_events(params, filter_by, &block) if type.eql?('javascript')
          end
        end

        def on_javascript_exception(&block)
          on_log do |params|
            type = params['type']
            javascript_log_events(params, FilterBy.log_level('error'), &block) if type.eql?('javascript')
          end
        end

        def on_log(filter_by = nil, &)
          unless filter_by.nil?
            check_valid_filter(filter_by)

            on(:entry_added) do |params|
              yield(params) if params['level'] == filter_by.level
            end
            return
          end

          on(:entry_added, &)
        end

        private

        def on(event, &)
          event = EVENTS[event] if event.is_a?(Symbol)
          @bidi.add_callback("log.#{event}", &)
        end

        def check_valid_filter(filter_by)
          return if filter_by.nil? || filter_by.instance_of?(FilterBy)

          raise "Pass valid FilterBy object. Received: #{filter_by.inspect}"
        end

        def console_log_events(params, filter_by)
          event = ConsoleLogEntry.new(
            level: params['level'],
            text: params['text'],
            timestamp: params['timestamp'],
            type: params['type'],
            method: params['method'],
            realm: params['realm'],
            args: params['args'],
            stack_trace: params['stackTrace']
          )

          unless filter_by.nil?
            yield(event) if params['level'] == filter_by.level
            return
          end

          yield(event)
        end

        def javascript_log_events(params, filter_by)
          event = JavascriptLogEntry.new(
            level: params['level'],
            text: params['text'],
            timestamp: params['timestamp'],
            type: params['type'],
            stack_trace: params['stackTrace']
          )

          unless filter_by.nil?
            yield(event) if params['level'] == filter_by.level
            return
          end

          yield(event)
        end
      end # LogInspector
    end # Bidi
  end # WebDriver
end # Selenium
