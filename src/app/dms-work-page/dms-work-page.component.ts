import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Subject, Subscription, switchMapTo, takeUntil, tap } from 'rxjs';
import { SidebarService } from '../shared/services/sidebar-service';
@Component({
    selector: 'app-dms-work-page',
    templateUrl: './dms-work-page.component.html',
    styleUrls: ['./dms-work-page.component.css']
})
export class DmsWorkPageComponent implements OnInit, OnDestroy, AfterViewInit {
    opened = true;
    sidebarSubscription = new Subscription();
    navWidth = 400;
    resizing = false;
    private $componentDestroyed = new Subject();

    @ViewChild('mover') mover: ElementRef<HTMLElement> = {} as ElementRef;
    constructor(private sidebarService: SidebarService) {}

    ngAfterViewInit(): void {
        const element = this.mover.nativeElement;
        const mousedown$ = fromEvent(element, 'mousedown');
        const mousemove$ = fromEvent(document, 'mousemove');
        const mouseup$ = fromEvent(document, 'mouseup');

        mousedown$
            .pipe(
                switchMapTo(
                    mousemove$.pipe(
                        tap((event: any) => {
                            this.sidebarService.setSidebarWidth(event.clientX);
                        }),
                        takeUntil(mouseup$)
                    )
                ),
                takeUntil(this.$componentDestroyed)
            )
            .subscribe();
    }

    ngOnInit(): void {
        this.sidebarService.$toggleSidebar.pipe(takeUntil(this.$componentDestroyed)).subscribe((isOpened) => {
            this.opened = isOpened;
        });
        this.sidebarService.$sidebarWidth.pipe(takeUntil(this.$componentDestroyed)).subscribe((width) => {
            this.navWidth = width;
        });
    }
    ngOnDestroy(): void {
        this.$componentDestroyed.next(true);
    }

    onToggleEvent() {
        this.sidebarService.toggle();
    }
}
