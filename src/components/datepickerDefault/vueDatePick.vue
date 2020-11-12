<template>
    <div class="vdpComponent" :class="{vdpWithInput: hasInputElement}">
        <slot
            :open="open"
            :close="close"
            :toggle="toggle"
            :inputValue="inputValue"
            :processUserInput="processUserInput"
            :valueToInputFormat="valueToInputFormat"
        >
            <input
                v-if="hasInputElement"
                type="text"
                v-bind="inputAttributes"
                :readonly="isReadOnly"
                :value="inputValue"
                @input="editable && processUserInput($event.target.value)"
                @focus="editable && open()"
                @click="editable && open()"
            >
            <button
                v-if="editable && hasInputElement && inputValue"
                class="vdpClearInput"
                type="button"
                @click="clear"
            ></button>
        </slot>
        <transition name="vdp-toggle-calendar">
            <div
                v-if="opened"
                class="vdpOuterWrap"
                ref="outerWrap"
                @click="closeViaOverlay"
                :class="[positionClass, {vdpFloating: hasInputElement}]"
            >
                <div class="vdpInnerWrap">
                    <header class="vdpHeader">
                        <button
                            class="vdpArrow vdpArrowPrev"
                            :title="prevMonthCaption"
                            type="button"
                            @click="incrementMonth(-1)"
                        >{{ prevMonthCaption }}</button>
                        <button
                            class="vdpArrow vdpArrowNext"
                            type="button"
                            :title="nextMonthCaption"
                            @click="incrementMonth(1)"
                        >{{ nextMonthCaption }}</button>
                        <div class="vdpPeriodControls">
                            <div class="vdpPeriodControl">
                                <button :class="directionClass" :key="currentPeriod.month" type="button">
                                    {{ months[currentPeriod.month] }}
                                </button>
                                <select v-model="currentPeriod.month">
                                    <option v-for="(month, index) in months" :value="index" :key="month">
                                        {{ month }}
                                    </option>
                                </select>
                            </div>
                            <div class="vdpPeriodControl">
                                <button :class="directionClass" :key="currentPeriod.year" type="button">
                                    {{ currentPeriod.year }}
                                </button>
                                <select v-model="currentPeriod.year">
                                    <option v-for="year in yearRange" :value="year" :key="year">
                                        {{ year }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </header>
                    <table class="vdpTable">
                        <thead>
                            <tr>
                                <th class="vdpHeadCell" v-for="(weekday, weekdayIndex) in weekdaysSorted" :key="weekdayIndex">
                                    <span class="vdpHeadCellContent">{{weekday}}</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody
                            :key="currentPeriod.year + '-' + currentPeriod.month"
                            :class="directionClass"
                        >
                            <tr class="vdpRow" v-for="(week, weekIndex) in currentPeriodDates" :key="weekIndex">
                                <td
                                    class="vdpCell"
                                    v-for="item in week"
                                    :class="{
                                        selectable: editable && !item.disabled,
                                        selected: item.selected,
                                        disabled: item.disabled,
                                        today: item.today,
                                        outOfRange: item.outOfRange
                                    }"
                                    :data-id="item.dateKey"
                                    :key="item.dateKey"
                                    @click="editable && selectDateItem(item)"
                                >
                                    <div
                                        class="vdpCellContent"
                                    >{{ item.date.getDate() }}</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-if="pickTime && currentTime" class="vdpTimeControls">
                        <span class="vdpTimeCaption">{{ setTimeCaption }}</span>
                        <div class="vdpTimeUnit">
                            <pre><span>{{ currentTime.hoursFormatted }}</span><br></pre>
                            <input
                                type="number" pattern="\d*" class="vdpHoursInput"
                                @input.prevent="inputHours"
                                @focusin="onTimeInputFocus"
                                :disabled="!editable"
                                :value="currentTime.hoursFormatted"
                            >
                        </div>
                        <span v-if="pickMinutes" class="vdpTimeSeparator">:</span>
                        <div v-if="pickMinutes" class="vdpTimeUnit">
                            <pre><span>{{ currentTime.minutesFormatted }}</span><br></pre>
                            <input
                                v-if="pickMinutes"
                                type="number" pattern="\d*" class="vdpMinutesInput"
                                @input="inputTime('setMinutes', $event)"
                                @focusin="onTimeInputFocus"
                                :disabled="!editable"
                                :value="currentTime.minutesFormatted"
                            >
                        </div>
                        <span v-if="pickSeconds" class="vdpTimeSeparator">:</span>
                        <div v-if="pickSeconds" class="vdpTimeUnit">
                            <pre><span>{{ currentTime.secondsFormatted }}</span><br></pre>
                            <input
                                v-if="pickSeconds"
                                type="number" pattern="\d*" class="vdpSecondsInput"
                                @input="inputTime('setSeconds', $event)"
                                @focusin="onTimeInputFocus"
                                :disabled="!editable"
                                :value="currentTime.secondsFormatted"
                            >
                        </div>
                        <button
                            v-if="use12HourClock"
                            type="button" class="vdp12HourToggleBtn"
                            :disabled="!editable"
                            @click="set12HourClock(currentTime.isPM ? 'AM' : 'PM')"
                        >
                            {{ currentTime.isPM ? 'PM' : 'AM' }}
                        </button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script src="./vueDatePick.ts" lang="ts" ></script>
<style src="./vueDatePick.scss" lang="scss" scoped></style>
<style src="./customStyles.scss" lang="scss" scoped></style>
