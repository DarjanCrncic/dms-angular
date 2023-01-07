import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-admininstration-search-component',
    templateUrl: './admininstration-search-component.component.html',
    styleUrls: ['./admininstration-search-component.component.css']
})
export class AdmininstrationSearchComponentComponent {
    url: FormControl = new FormControl('/documents');
    search: FormControl = new FormControl('');
    response: any;
    loading: boolean = false;

    constructor(private http: HttpClient) {}

    triggerCall($event: KeyboardEvent) {
        if ($event.key == 'Enter') {
            this.doSearch();
        }
    }

    doSearch() {
        const url = this.url.value;
        const search = this.search.value;

        this.loading = true;
        this.http
            .get(environment.baseUrl + url, {
                params: {
                    search: search
                }
            })
            .subscribe(
                (res) => {
                    this.response = JSON.stringify(res, null, 4);
                },
                (err) => {
                    this.response = JSON.stringify(err, null, 4);
                },
                () => {
                    this.loading = false;
                }
            );
    }

    syntaxHighlight(json: any) {
        if (!json) {
            return;
        }
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(
            /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
            function (match: any) {
                var cls = 'number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'key';
                    } else {
                        cls = 'string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'boolean';
                } else if (/null/.test(match)) {
                    cls = 'null';
                }
                return '<span class="' + cls + '">' + match + '</span>';
            }
        );
    }
}
